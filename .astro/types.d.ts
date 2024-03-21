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
		"movies": {
"2021_金馬影展/不要靜靜駛入長夜.md": {
	id: "2021_金馬影展/不要靜靜駛入長夜.md";
  slug: "2021_金馬影展/不要靜靜駛入長夜";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/吾愛吾詩.md": {
	id: "2021_金馬影展/吾愛吾詩.md";
  slug: "2021_金馬影展/吾愛吾詩";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/喜怒哀樂.md": {
	id: "2021_金馬影展/喜怒哀樂.md";
  slug: "2021_金馬影展/喜怒哀樂";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/我復仇，你付錢.md": {
	id: "2021_金馬影展/我復仇，你付錢.md";
  slug: "2021_金馬影展/我復仇你付錢";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/樂隊來訪時.md": {
	id: "2021_金馬影展/樂隊來訪時.md";
  slug: "2021_金馬影展/樂隊來訪時";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/正義老司機.md": {
	id: "2021_金馬影展/正義老司機.md";
  slug: "2021_金馬影展/正義老司機";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/水手服與機關槍.md": {
	id: "2021_金馬影展/水手服與機關槍.md";
  slug: "2021_金馬影展/水手服與機關槍";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/河畔小日子.md": {
	id: "2021_金馬影展/河畔小日子.md";
  slug: "2021_金馬影展/河畔小日子";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/法蘭西特派週報.md": {
	id: "2021_金馬影展/法蘭西特派週報.md";
  slug: "2021_金馬影展/法蘭西特派週報";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/海上花＋華麗寫實.md": {
	id: "2021_金馬影展/海上花＋華麗寫實.md";
  slug: "2021_金馬影展/海上花華麗寫實";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/瀑布.md": {
	id: "2021_金馬影展/瀑布.md";
  slug: "2021_金馬影展/瀑布";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/犬山記.md": {
	id: "2021_金馬影展/犬山記.md";
  slug: "2021_金馬影展/犬山記";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/狼行者.md": {
	id: "2021_金馬影展/狼行者.md";
  slug: "2021_金馬影展/狼行者";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/硬漢小情歌.md": {
	id: "2021_金馬影展/硬漢小情歌.md";
  slug: "2021_金馬影展/硬漢小情歌";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/緝魂.md": {
	id: "2021_金馬影展/緝魂.md";
  slug: "2021_金馬影展/緝魂";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/繼園臺七號.md": {
	id: "2021_金馬影展/繼園臺七號.md";
  slug: "2021_金馬影展/繼園臺七號";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/酷愛電影的龐波小姐.md": {
	id: "2021_金馬影展/酷愛電影的龐波小姐.md";
  slug: "2021_金馬影展/酷愛電影的龐波小姐";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/魂斷威尼斯.md": {
	id: "2021_金馬影展/魂斷威尼斯.md";
  slug: "2021_金馬影展/魂斷威尼斯";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/魔法阿嬤.md": {
	id: "2021_金馬影展/魔法阿嬤.md";
  slug: "2021_金馬影展/魔法阿嬤";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"2021_金馬影展/鹿王.md": {
	id: "2021_金馬影展/鹿王.md";
  slug: "2021_金馬影展/鹿王";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
"駭客任務：復活.md": {
	id: "駭客任務：復活.md";
  slug: "駭客任務復活";
  body: string;
  collection: "movies";
  data: InferEntrySchema<"movies">
} & { render(): Render[".md"] };
};
"novels": {
"魔王/大綱.md": {
	id: "魔王/大綱.md";
  slug: "魔王/大綱";
  body: string;
  collection: "novels";
  data: any
} & { render(): Render[".md"] };
"魔王/序章.md": {
	id: "魔王/序章.md";
  slug: "魔王/序章";
  body: string;
  collection: "novels";
  data: any
} & { render(): Render[".md"] };
"魔王/角色設定.md": {
	id: "魔王/角色設定.md";
  slug: "魔王/角色設定";
  body: string;
  collection: "novels";
  data: any
} & { render(): Render[".md"] };
};
"posts": {
"eisenhower-method.md": {
	id: "eisenhower-method.md";
  slug: "eisenhower-method";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"stories/practice-20170430.md": {
	id: "stories/practice-20170430.md";
  slug: "stories/practice-20170430";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"stories/practice-20170503.md": {
	id: "stories/practice-20170503.md";
  slug: "stories/practice-20170503";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"stories/practice-20170508.md": {
	id: "stories/practice-20170508.md";
  slug: "stories/practice-20170508";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"stories/practice-20170626.md": {
	id: "stories/practice-20170626.md";
  slug: "stories/practice-20170626";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"stories/practice-20170711.md": {
	id: "stories/practice-20170711.md";
  slug: "stories/practice-20170711";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"typescript-import-module.md": {
	id: "typescript-import-module.md";
  slug: "typescript-import-module";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"webpack-basic-usage.md": {
	id: "webpack-basic-usage.md";
  slug: "webpack-basic-usage";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"when-to-refactor.md": {
	id: "when-to-refactor.md";
  slug: "when-to-refactor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"games": {
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
