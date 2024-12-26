declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2012-02-04-testing-template.md": {
	id: "2012-02-04-testing-template.md";
  slug: "2012/02/04/testing-template";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-03-10-internationalization-in-spirit.md": {
	id: "2012-03-10-internationalization-in-spirit.md";
  slug: "2012/03/10/internationalization-in-spirit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-03-19-override-and-debug.md": {
	id: "2012-03-19-override-and-debug.md";
  slug: "2012/03/19/override-and-debug";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-03-27-internationalization-in-spirit-part-2.md": {
	id: "2012-03-27-internationalization-in-spirit-part-2.md";
  slug: "2012/03/27/internationalization-in-spirit-part-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-04-05-mark-it-down.md": {
	id: "2012-04-05-mark-it-down.md";
  slug: "2012/04/05/mark-it-down";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-05-07-code-on-move.md": {
	id: "2012-05-07-code-on-move.md";
  slug: "2012/05/07/code-on-move";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-06-13-internationalization-in-spirit-part-3.md": {
	id: "2012-06-13-internationalization-in-spirit-part-3.md";
  slug: "2012/06/13/internationalization-in-spirit-part-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-07-26-thats-not-fragmentation-but-then-what-is.md": {
	id: "2012-07-26-thats-not-fragmentation-but-then-what-is.md";
  slug: "2012/07/26/thats-not-fragmentation-but-then-what-is";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-09-29-google-play-services-and-why-we-still.md": {
	id: "2012-09-29-google-play-services-and-why-we-still.md";
  slug: "2012/09/29/google-play-services-and-why-we-still";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-12-03-android-application-level-pause-and.md": {
	id: "2012-12-03-android-application-level-pause-and.md";
  slug: "2012/12/03/android-application-level-pause-and";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012-12-18-code-smells-calling-life-cycle-methods.md": {
	id: "2012-12-18-code-smells-calling-life-cycle-methods.md";
  slug: "2012/12/18/code-smells-calling-life-cycle-methods";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-01-05-extensibility-and-immutability-in-java.md": {
	id: "2013-01-05-extensibility-and-immutability-in-java.md";
  slug: "2013/01/05/extensibility-and-immutability-in-java";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-01-29-android-ondestroy-is-new-onstop.md": {
	id: "2013-01-29-android-ondestroy-is-new-onstop.md";
  slug: "2013-01-29-android-ondestroy-is-new-onstop";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-02-01-android-passing-arbitrary-object-to.md": {
	id: "2013-02-01-android-passing-arbitrary-object-to.md";
  slug: "2013-02-01-android-passing-arbitrary-object-to";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-02-18-android-constants-preference-keys.md": {
	id: "2013-02-18-android-constants-preference-keys.md";
  slug: "2013-02-18-android-constants-preference-keys";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-03-09-shift-to-octopress-postponed.md": {
	id: "2013-03-09-shift-to-octopress-postponed.md";
  slug: "2013-03-09-shift-to-octopress-postponed";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013-06-08-android-listviews-hybrid-choice-behavior.md": {
	id: "2013-06-08-android-listviews-hybrid-choice-behavior.md";
  slug: "2013-06-08-android-listviews-hybrid-choice-behavior";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014-01-25-nested-fragments-and-back-stack.md": {
	id: "2014-01-25-nested-fragments-and-back-stack.md";
  slug: "2014-01-25-nested-fragments-and-back-stack";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014-02-02-nested-fragment-and-backstack-part-2.md": {
	id: "2014-02-02-nested-fragment-and-backstack-part-2.md";
  slug: "2014-02-02-nested-fragment-and-backstack-part-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014-02-09-nested-fragments-and-backstack-part-3.md": {
	id: "2014-02-09-nested-fragments-and-backstack-part-3.md";
  slug: "2014-02-09-nested-fragments-and-backstack-part-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-08-09-ao-spy-1.md": {
	id: "2015-08-09-ao-spy-1.md";
  slug: "2015/08/12/ao-spy-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015-08-20-ao-spy-2.md": {
	id: "2015-08-20-ao-spy-2.md";
  slug: "2015/09/06/ao-spy-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-03-05-kotlin-coi.md": {
	id: "2017-03-05-kotlin-coi.md";
  slug: "2017/03/05/kotlin-coi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-04-03-java-value-classes-equals.md": {
	id: "2017-04-03-java-value-classes-equals.md";
  slug: "2017/04/03/java-value-classes-equals";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017-05-25-one-size-doesnt-fit-all.md": {
	id: "2017-05-25-one-size-doesnt-fit-all.md";
  slug: "2017/05/25/one-size-doesnt-fit-all";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-01-06-diff-util-part1.md": {
	id: "2020-01-06-diff-util-part1.md";
  slug: "2020/01/06/diff-util-part1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-01-07-diff-util-part2.md": {
	id: "2020-01-07-diff-util-part2.md";
  slug: "2020/01/07/diff-util-part2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-01-12-diff-util-part3.md": {
	id: "2020-01-12-diff-util-part3.md";
  slug: "2020/01/12/diff-util-part3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-03-31-gradle-missing-flavors.md": {
	id: "2020-03-31-gradle-missing-flavors.md";
  slug: "2020/03/31/gradle-missing-flavors";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-04-21-diff-animations-swiftui.md": {
	id: "2020-04-21-diff-animations-swiftui.md";
  slug: "2020/04/21/diff-animations-swiftui";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-05-22-flutter-stateless-animations.md": {
	id: "2020-05-22-flutter-stateless-animations.md";
  slug: "2020/05/21/flutter-stateless-animations";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-10-24-falsehoods-about-addresses.md": {
	id: "2020-10-24-falsehoods-about-addresses.md";
  slug: "2020/10/24/falsehoods-about-addresses";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-12-15-scalable-tech-business.md": {
	id: "2020-12-15-scalable-tech-business.md";
  slug: "2020/12/15/scalable-tech-business";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-12-18-tech-enhancer.md": {
	id: "2020-12-18-tech-enhancer.md";
  slug: "2020/12/18/tech-enhancer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020-12-20-ui-not-ux.md": {
	id: "2020-12-20-ui-not-ux.md";
  slug: "2020/12/20/ui-not-ux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-03-13-privacy-friendly-analytics.md": {
	id: "2021-03-13-privacy-friendly-analytics.md";
  slug: "2021/03/13/privacy-friendly-analytics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-03-20-facebook-privacy.md": {
	id: "2021-03-20-facebook-privacy.md";
  slug: "2021/03/20/facebook-privacy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-03-21-basic-first.md": {
	id: "2021-03-21-basic-first.md";
  slug: "2021/03/21/basic-first";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-07-24-mobile-multiplatform.md": {
	id: "2021-07-24-mobile-multiplatform.md";
  slug: "2021/07/24/mobile-multiplatform";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-07-31-writing-as-problem-solving.md": {
	id: "2021-07-31-writing-as-problem-solving.md";
  slug: "2021/07/31/writing-as-problem-solving";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-08-01-digital-identity-conundrum.md": {
	id: "2021-08-01-digital-identity-conundrum.md";
  slug: "2021/08/01/digital-identity-conundrum";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-08-14-hiring-in-tech.md": {
	id: "2021-08-14-hiring-in-tech.md";
  slug: "2021/08/14/hiring-in-tech";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021-12-03-jetpack-compose-slots.md": {
	id: "2021-12-03-jetpack-compose-slots.md";
  slug: "2021/12/03/jetpack-compose-slots";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-01-17-framework-laptop-owner-review.md": {
	id: "2023-01-17-framework-laptop-owner-review.md";
  slug: "2023/01/17/framework-laptop-owner-review";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023-04-26-fairphone-review.md": {
	id: "2023-04-26-fairphone-review.md";
  slug: "2023/04/26/fairphone-review";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"pages": Record<string, {
  id: string;
  collection: "pages";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
