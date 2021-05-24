/**
 * Socket command word.
 */
export enum CommandWord {
  RF = 'rf',
  OS = 'os',
  CR = 'cr',
  RO = 'ro',
  HO = 'ho',
  HF = 'hf',
  NF = 'nf',
}

/**
 * Socket command word string.
 */
export type CommandWordString = 'RF' | 'OS' | 'CR' | 'RO' | 'HO' | 'HF' | 'NF';
