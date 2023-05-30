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
exports.Favorites = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Film_1 = require("./Film");
let Favorites = class Favorites extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = (0, uuid_1.v4)();
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Favorites.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Favorites.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Film_1.Film),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Favorites.prototype, "films", void 0);
Favorites = __decorate([
    (0, typeorm_1.Entity)()
], Favorites);
exports.Favorites = Favorites;
