// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CategoryEntity } from '@esc/product/models';

export const isCategory = (value: unknown): value is CategoryEntity => {
  return (value as CategoryEntity).name !== undefined;
};
