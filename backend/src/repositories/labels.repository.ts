import {prisma} from "../db/prisma"

const findAllLabels = () => {
    return prisma.labels.findMany();

};

const findLabelById = (label_id: number) => {
    return prisma.labels.findUnique({
        where: {label_id}
    })
};

const findLabelByName = (label_name:string) => {
    return prisma.labels.findUnique({
        where: {label_name}
    })
};


const createLabel = (data: {label_name: string;}) => {
    return prisma.labels.create({data})
    
};

const updateLabel = (label_id: number, data: Partial<{label_name: string}>) => {
    return prisma.labels.update({where: {label_id},data})

};

const deleteLabel = (label_id: number) => {

    return prisma.labels.delete({where:{label_id}})

};

export {
findAllLabels,
findLabelById,
findLabelByName,
createLabel,
updateLabel,
deleteLabel
};