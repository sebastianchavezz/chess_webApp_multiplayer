"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
// entities/Game.ts
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
let Game = class Game extends typeorm_1.BaseEntity {
};
exports.Game = Game;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Game.prototype, "is_finished", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Player_1.Player),
    (0, typeorm_1.JoinColumn)({ name: 'player_id' }),
    __metadata("design:type", Player_1.Player)
], Game.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "move_history", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Game.prototype, "turn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', array: true, nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "board", void 0);
exports.Game = Game = __decorate([
    (0, typeorm_1.Entity)()
], Game);
