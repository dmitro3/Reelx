import { ToyRto } from './toy.rto';

export class StartGameResponseRto {
  result: 'win' | 'lose';
  gifts: ToyRto[];
}

