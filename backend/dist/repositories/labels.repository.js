"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLabel = exports.updateLabel = exports.createLabel = exports.findLabelByName = exports.findLabelById = exports.findAllLabels = void 0;
const prisma_1 = require("../db/prisma");
const findAllLabels = () => {
    return prisma_1.prisma.labels.findMany();
};
exports.findAllLabels = findAllLabels;
const findLabelById = (label_id) => {
    return prisma_1.prisma.labels.findUnique({
        where: { label_id }
    });
};
exports.findLabelById = findLabelById;
const findLabelByName = (label_name) => {
    return prisma_1.prisma.labels.findUnique({
        where: { label_name }
    });
};
exports.findLabelByName = findLabelByName;
const createLabel = (data) => {
    return prisma_1.prisma.labels.create({ data });
};
exports.createLabel = createLabel;
const updateLabel = (label_id, data) => {
    return prisma_1.prisma.labels.update({ where: { label_id }, data });
};
exports.updateLabel = updateLabel;
const deleteLabel = (label_id) => {
    return prisma_1.prisma.labels.delete({ where: { label_id } });
};
exports.deleteLabel = deleteLabel;
