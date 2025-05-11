---
title:  "Embrace the SQL, ORMs!"
description: "Advocating the use of ORMs to abstract over query results, not the query itself"
publishDate: 2025-05-07
comments: true
tags: [sql, orm]
seo:
  image:
    src: '/blog/assets/img/embrace-sql-code-snippet.png'
    alt: 'Code snippet showing queries using SQL versus language-specific abstractions'
slug: embrace-sql
---

## Introduction

When writing software, sooner or later you'll come across the need to persist structured data, which means sooner or later you'll need to use a database. Among the most widely used databases are SQL databases.

However, SQL is not your typical programming language. When writing an application in a language geared towards that task, interspersing SQL into it often causes impedance mismatch. This has led to the proliferation of database abstraction libraries.

One of the most common abstractions are [ORMs](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (Object-relational mappers). These serve two purposes:

1. Abstract over the **SQL query** part. In other words, they attempt to use the features of the host programming language to express SQL queries. This could be in the form of function calls, regular control flow statements of the language, or even a custom DSL.
2. Abstract over the **query results and iteration**. SQL databases return their results as records or cursors. It is often cumbersome to work with these in the application programming laguage. ORMs turn these query results into regular objects or collections making them more natural to use in the host language.

> This post advocates that ORMs ought to stay as close to SQL as possible for the query part; and only offer abstractions for the result processing part. 

This opinion comes from my own experience using several ORMs over the years, including

- [JPA/Hibernate](https://hibernate.org/orm/) (Java, server, multiple databases)
- [Room](https://developer.android.com/training/data-storage/room) (Java/Kotlin, Android, SQLite)
- [SqlDelight](https://sqldelight.github.io/sqldelight/) (Kotlin, Android/iOS, SQLite)
- [GRDB](https://github.com/groue/GRDB.swift) (Swift, iOS, SQLite)
- [JOOQ](https://www.jooq.org/) (Java/Kotlin, server, Postgres)

## A performance degradation case study

First, let's look at how I introduced a critical performance problem in our production server because of a mismatch between an indexed column and a column used in a WHERE clause. This blog post uses a fictitous use case (imaginary table and column names), but it is sufficient to demonstrate the problem.

The use case is a table that saves user activity (as in, physical activity). There are some traditional columns but most of the interesting info is in a JSONB column (named `data`). Here's the table definition:
```sql {8}
-- Postgres Table and index definition
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY NOT NULL,
  activity_name TEXT NOT NULL,
  data JSONB
);

CREATE INDEX activity_log_session_id_idx ON activity_log((data ->> 'session_id'));
CREATE INDEX activity_log_activity_name_idx on activity_log(activity_name);
```
Note the highlighted line in the code snippet above. This creates an index on _the JSON property_ with key `session_id` within the `data` column; for example if the data column is represented by the following JSON:
```json
{
    "session_id": 12345678,
    "params": {
        "runtime": 424242,
        "segments": [...]
    }
}
```
Now, my goal is to find all cycling activities with a specific session_id. With Postgres 15.x, here's what the query looks like:
```sql
SELECT data FROM activity_log
WHERE data ->> 'session_id' = '12345678'
AND activity_name = 'activity_cycling';
```

I need to write that in Java, of course. Using JOOQ 15, here was my first attempt:
```java {3}
var cyclingResults = dsl.select(ACTIVITY_LOG.DATA)
    .from(ACTIVITY_LOG)
    .where(jsonbValue(ACTIVITY_LOG.DATA, "$.session_id").eq("12345678"))
    .and(ACTIVITY_LOG.ACTIVITY_NAME.eq("activity_cycling"));
```
The highlighted line is the most relevant one. Since my version of Jooq did not support the `->>` syntax, I used the `jsonbValue` API to achieve the equivalent. Or, so I thought!

In reality `jsonbValue(ACTIVITY_LOG.DATA, "$.session_id"` is equivalent to `data -> 'session_id'` while we created the index on `data ->> 'session_id'`. Do you spot the difference?
```diff lang="sql"
- WHERE data ->> 'session_id' = '12345678'
+ WHERE data -> 'session_id' = '12345678'
```
This is equivalent to using an un-indexed column in a `WHERE` clause, which means that the database has to perform a full scan on the table. In a table with a few million rows, the performance difference could be a couple of orders or magnitude!

So, what's the fix? Well, I already know what SQL I want, but how do I get my ORM to output that specific SQL? I'll spare you the details, but in Jooq 3.15, this is how you do it. There are better ways in more recent versions of Jooq though (thanks ChatGPT for helping me with this!). 

You need to use the escape hatch and use "raw SQL", but not really because thankfully Jooq has this placeholder syntax that allows you to avoid SQL injection and at the same time avoid harcoding things like column names (that's the `{0}` syntax in the code snippet below). 
```java {3}
var cyclingResults = dsl.select(ACTIVITY_LOG.DATA)
	.from(ACTIVITY_LOG)
    .where(DSL.field("{0} ->> 'session_id'", Long.class, ACTIVITY_LOG.DATA).eq(12345678));
```

## ORMs and leaky abstractions

Before looking into the specific details of ways in which abstractions can leak the underlying SQL, I want to acknowledge that almost every ORM offers an escape hatch to use raw SQL. I argue that this is a sign that SQL should not have been abstracted over in the first place.

### Querying using a programming language is a leaky abstraction

Whenever I need to perform a non-trivial query in my applications, this is the path that I follow

1. Figure out how to write the SQL query in the target database (Postgres, SQLite etc)
2. Try to reverse-engineer that SQL query into my ORM

Thus, the "wrapper" or the "abstraction" that ORMs provide over SQL queries leak anyway. This is what happened in the above case study.

### Table definition using programming languages is a leaky abstraction

In some ORMs/database libraries, the table definition is not done using SQL. Instead, they use programming language constructs like a class, where the fields become columns.

An example of this is Room, where the you define a class along with some annotations to define the table name, constraints like primary keys, column names and indices. You can see an example from the [Room documentation](https://developer.android.com/training/data-storage/room/defining-data#column-indexing).

This works fine for simple cases but invariably the underlying SQL leaks when you go for slightly more complex cases involving indices nested inside JSON(B) fields, foreign keys etc.

Another example of this is GDRB which provides a DSL for defining the schema. A similar schema also exists for defining migrations. You then define a struct that conforms to certain protocols to act as the strongly typed data type for inserting/querying the database. From the documentation:
```swift
try dbQueue.write { db in
    try db.create(table: "player") { t in
        t.primaryKey("id", .text)
        t.column("name", .text).notNull()
        t.column("score", .integer).notNull()
    }
}

struct Player: Codable, FetchableRecord, PersistableRecord {
    var id: String
    var name: String
    var score: Int
}
```

This looks fine for simple cases, but once you need to have relationships, it leads to a steep increase in the number of concepts to know. Just look at the [documentation for associations](https://github.com/groue/GRDB.swift/blob/master/Documentation/AssociationsBasics.md). At some point you'll run into a `JOIN` query that cannot be represented using GRDB and you'll need to drop to SQL.

### If one of DDL and DML are in SQL, then the abstraction leaks

In Room, the tables are defined using a class, but queries are written [using SQL](https://developer.android.com/training/data-storage/room/accessing-data).
As a result, "class-as-a-DDL" is a leaky abstraction.

In server-side development, it is common to use some sort of migration tool (like [flyway](https://github.com/flyway/flyway) for Java) to keep evolving your database schema. What this means is that your DDL is plain SQL, i.e, you use SQL to create your tables. However, your queries are performed using Java. This is a leaky abstraction.

## SqlDelight shows the way

Does this mean that we should be using raw SQL and working with cursors? Not at all!

SqlDelight is a great example of the right level of abstraction for a database library. You define your tables and queries together in an `.sq` (or `.sqm` for migration) file. This is a superset of SQL with a few small additions.

 Let's circle back to the original example. Here's what it would look like using SqlDelight:
 ```sql title="ActivityLog.sq"
 -- Postgres Table and index definition
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY NOT NULL,
  activity_name TEXT NOT NULL,
  data JSONB
);

CREATE INDEX activity_log_session_id_idx ON activity_log((data ->> 'session_id'));
CREATE INDEX activity_log_activity_name_idx on activity_log(activity_name);

getActivitiesByTypeForSession:
SELECT data FROM activity_log
WHERE data ->> 'session_id' = :sessionId
AND activity_name = :activityName;
 ```
This would generate a Kotlin class named `ActivityLogQueries` and a method `getActivitiesByTypeForSession` with the following signature
```kotlin
fun getActivitiesByTypeForSession(sessionId: Long, activityName: String):
    List<GetActivitiesByTypeForSession>

// This is a data class generated by SqlDelight to represent the result of each query
data class GetActivitiesByTypeForSession(val data: String)
```

So your application code never needs to deal with SQL - it only deals with idiomatic Kotlin APIs. You still get to retain the power of SQL at the right level of abstraction.

> SqlDelight places SQL front and center. You use regular SQL for your queries, and the library shines in abstracting over parameters, custom data types and of course result sets.

Sqldelight also provides an IDE plugin for syntax highlighting and auto-completion in the `.sq` and `.sqm` files.

### Side note: Abstracting over results

Almost all ORMs that I mentioned above do a good job of abstracting over results. For example in Jooq, the `Result` implements `Iterable`, so you can immediately call `stream()` on it and use Java8 stream operations.

But even that is not entirely true. In some ORMs, it is not obvious when JOINs are being performed, or whether relations are being loaded lazily or eagerly. JPA was notorious for this. This is another example where using SQL to define the queries would make eliminate confusion.

----

## Window shopping for other ORMs

So far the discussion has focused around the ORMs that I've worked with directly. However, I thought it would be fun to look at what's cooking, both within the ecosystems that I'm familiar with and outside.

### Terpal SQL (Kotlin)

[Terpal](https://terpal.io) is a relatively recent SQL library for Kotlin. It allows you to write SQL queries in plain Strings while still being safe from SQL injection. It does this using a Kotlin compiler plugin. Example from the docs
```kotlin
Sql("SELECT * FROM Person WHERE name = $name").queryOf<Person>().runOn(ctx)
```

In my opinion, Terpal gets this right. It works with plain SQL while abstracting over the results. I still prefer SqlDelight's approach of separating out the queries into a separate file.

### ExoQuery (Kotlin)

[Exoquery](https://github.com/ExoQuery/ExoQuery) is from the same folks who brought Terpal and it is layered on top of Terpal. It is a sort of Kotlin DSL that generates SQL at compile time. Example from their docs
```kotlin
capture.select {
  val p = from(people)
  val a = join(addresses) { a -> a.personId == p.id }
  Data(p.name, a.city, if (p.age > 18) 'adult' else 'minor')
}
//> SELECT p.name, a.city, CASE WHEN p.age > 18 THEN 'adult' ELSE 'minor' END FROM Person p JOIN Address a ON a.personId = p.id
```

Exoquery is infinitely cool in that it shows what is possible to achieve technically. However, if I apply the advice I've given in this post, then I've got to say that Exoquery operates at the wrong level of abstraction.

### LINQ

[LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/) is a sort of DSL integrated into C# and has been the north star for ORMs for several years. From the examples
```cs
IEnumerable<int> scoreQuery =
    from score in scores
    where score > 80
    select score;
```
This looks very clean and SQL-esque. I don't work with .Net or C# so I'm not really in a position to judge what the developer experience of this is. That said, I'm willing to bet that even with this clean syntax, details of the underlying database are bound to leak eventually.

### Diesel (Rust)

[Diesel](https://diesel.rs/) is a Rust ORM and from the looks of it, it is the Rust equivalent of Jooq (at least syntactically). From the examples,
```rust
let versions = Version::belonging_to(krate)
  .select(id)
  .order(num.desc())
  .limit(5);
let downloads = version_downloads
  .filter(date.gt(now - 90.days()))
  .filter(version_id.eq(any(versions)))
  .order(date)
  .load::<Download>(&mut conn)?;
```
Executes the following SQL
```sql
SELECT version_downloads.*
  WHERE date > (NOW() - '90 days')
    AND version_id = ANY(
      SELECT id FROM versions
        WHERE crate_id = 1
        ORDER BY num DESC
        LIMIT 5
    )
  ORDER BY date
```

This is a case where the abstraction will eventually leak, and hence I don't recommend it.

### sqlx (Rust)

[sqlx](https://github.com/launchbadge/sqlx) is a Rust library (the README unequivocally states that it is **not** and ORM) that allows you to write compile-time checked SQL queries without a DSL. There are a few ways of writing the query. Here I show the `query_as!` macro from the example
```rust
// no traits are needed
struct Country { country: String, count: i64 }

let countries = sqlx::query_as!(Country,
        "
SELECT country, COUNT(*) as count
FROM users
GROUP BY country
WHERE organization = ?
        ",
        organization
    )
    .fetch_all(&pool) // -> Vec<Country>
    .await?;

// countries[0].country
// countries[0].count
```

To me, this is the abstraction done right. It is at the same level of abstraction as SqlDelight and Terpal.

----

## Conclusion

- Embrace SQL for data definition (creating tables and indices, migrations)
- Embrace SQL for data manipulation (insert, query, update)
- Use the features of your programming language to abstract over the query results

You can comment on this post on the [fediverse](https://androiddev.social/@kiranrao/114466830026757040) or on [LinkedIn](https://www.linkedin.com/posts/activity-7325879000067645441-Z8rp).

**Note:** The screenshot of the code snippet used in the `<meta>` tag of this post has been generated using [carbon](https://carbon.now.sh).
