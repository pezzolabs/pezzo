export type Primitive = string | boolean | number;

export type RecursiveObject<T> = {
  [key: string]: T | RecursiveObject<T>;
};

export type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

export type AllPrimitiveTypes =
  | Primitive
  | RecursiveObject<Primitive>
  | RecursiveArray<Primitive>;

export interface Pagination {
  page: number;
  size: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}
