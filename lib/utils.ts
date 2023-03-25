'use strict';

export const splitStringFromSpace = (text: string): string[] => text.replaceAll('　', ' ').split(' ');
