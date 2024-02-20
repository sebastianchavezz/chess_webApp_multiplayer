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
exports.Room = void 0;
// entities/Room.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Game_1 = require("./Game");
let Room = class Room extends typeorm_1.BaseEntity {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Room.prototype, "amount_player", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Game_1.Game),
    (0, typeorm_1.JoinColumn)({ name: 'game_id' }),
    __metadata("design:type", Game_1.Game)
], Room.prototype, "game", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)()
], Room);
