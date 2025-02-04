import * as React from 'react';
import { BoxProps } from '../Box/index';
import { BackgroundObject } from '../../utils';

type PageBackground = BackgroundObject & {
  fill?: 'horizontal';
};

export interface PageContentProps {
  background?: string | PageBackground;
}

export interface PageContentExtendedProps
  extends PageContentProps,
    Omit<BoxProps, 'background'> {}

declare const PageContent: React.FC<PageContentExtendedProps>;

export { PageContent };
