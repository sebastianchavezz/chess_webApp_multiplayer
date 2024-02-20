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
exports.Match = void 0;
// entities/Match.ts
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
const Room_1 = require("./Room");
let Match = class Match extends typeorm_1.BaseEntity {
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Match.prototype, "isFinished", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Player_1.Player),
    __metadata("design:type", Player_1.Player)
], Match.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, room => room.match) // Specify the inverse side here
    ,
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Room_1.Room)
], Match.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "moveHistory", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)()
], Match);
