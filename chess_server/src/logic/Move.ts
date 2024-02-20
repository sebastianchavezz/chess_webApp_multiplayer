//src/logic/Move.ts
import {From, To, Piece } from './Types';

class CastlingMove{
    rook_from_castle_x: number;
    rook_to_castle_x: number;
    rook_y: number;
    castling_direction: number;
    constructor(rook_from_castle_x:number, rook_to_castle_x:number, rook_y:number){
        this.rook_from_castle_x = rook_from_castle_x
        this.rook_to_castle_x = rook_to_castle_x;
        this.rook_y = rook_y;
        this.castling_direction = (rook_from_castle_x - rook_to_castle_x) === 2 ? 1 : -1;
        console.log('castling direction', this.castling_direction);
    }
}

export class Move {
    from: From;
    to: To;
    pieceMoved: string;
    pieceTaken: string;
    moveID: number;
    castle: boolean = false;
    castleMove: CastlingMove|null = null;
    en_passant: boolean = false;
    promotion: boolean = false;
  
    constructor(from: From, to: To, board: string[][]) {
      this.from = from;
      this.to = to;
      this.pieceMoved = board[from.y][from.x];
      this.pieceTaken = board[to.y][to.x];
      this.moveID = this.calculateMoveID();
    }
  
    calculateMoveID(): number {
      const { x: from_x, y: from_y } = this.from;
      const { x: to_x, y: to_y } = this.to;
      return from_y * 1000 + from_x * 100 + to_y * 10 + to_x;
    }
  
    equals(other: Move): boolean {
      return this.moveID === other.moveID;
    }
    setPromotion(): void {
      this.promotion = true;
    }
    
    getPromotion(): boolean {
      return this.promotion;
    }

    setCastle(x_from:number,x_to:number,turn:boolean): void {
      let y_turn = turn ? 7 : 0;
      this.castleMove = new CastlingMove(x_from,x_to,y_turn);
      this.castle = true;
    }
    
    can_castle(): boolean {
      return this.castle;
    }

    setEnPassant(): void {
      this.en_passant = true;
    }

    take_en_passant(): boolean {
      return this.en_passant;
    }

    getChessNotation(): string {
      const start = this.getRankFile(this.from.y, this.from.x);
      const end = this.getRankFile(this.to.y, this.to.x);
      return start + end;
    }

    private getRankFile(row: number, col: number): string {
      const filesToCols: any = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };
      const ranksToRows: any = { 0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8' };
      const colStr: any = filesToCols[col];
      const rowStr: any = ranksToRows[row];
  
      return colStr + rowStr;
    }
    toString(): string {
      return ` MoveID: ${this.moveID}, From: (x:${this.from.x}, y:${this.from.y}), To: (x:${this.to.x}, y:${this.to.y}), Piece Moved: ${this.pieceMoved}, Piece Taken: ${this.pieceTaken}`;
    }
  
  }