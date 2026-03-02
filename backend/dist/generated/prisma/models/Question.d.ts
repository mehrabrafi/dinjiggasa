import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type QuestionModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestionPayload>;
export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
export type QuestionAvgAggregateOutputType = {
    views: number | null;
};
export type QuestionSumAggregateOutputType = {
    views: number | null;
};
export type QuestionMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    body: string | null;
    views: number | null;
    authorId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type QuestionMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    body: string | null;
    views: number | null;
    authorId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type QuestionCountAggregateOutputType = {
    id: number;
    title: number;
    body: number;
    views: number;
    authorId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type QuestionAvgAggregateInputType = {
    views?: true;
};
export type QuestionSumAggregateInputType = {
    views?: true;
};
export type QuestionMinAggregateInputType = {
    id?: true;
    title?: true;
    body?: true;
    views?: true;
    authorId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type QuestionMaxAggregateInputType = {
    id?: true;
    title?: true;
    body?: true;
    views?: true;
    authorId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type QuestionCountAggregateInputType = {
    id?: true;
    title?: true;
    body?: true;
    views?: true;
    authorId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type QuestionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuestionCountAggregateInputType;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestion[P]> : Prisma.GetScalarType<T[P], AggregateQuestion[P]>;
};
export type QuestionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithAggregationInput | Prisma.QuestionOrderByWithAggregationInput[];
    by: Prisma.QuestionScalarFieldEnum[] | Prisma.QuestionScalarFieldEnum;
    having?: Prisma.QuestionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionCountAggregateInputType | true;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type QuestionGroupByOutputType = {
    id: string;
    title: string;
    body: string;
    views: number;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]>;
}>>;
export type QuestionWhereInput = {
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    title?: Prisma.StringFilter<"Question"> | string;
    body?: Prisma.StringFilter<"Question"> | string;
    views?: Prisma.IntFilter<"Question"> | number;
    authorId?: Prisma.StringFilter<"Question"> | string;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    answers?: Prisma.AnswerListRelationFilter;
    tags?: Prisma.TagListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
};
export type QuestionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    author?: Prisma.UserOrderByWithRelationInput;
    answers?: Prisma.AnswerOrderByRelationAggregateInput;
    tags?: Prisma.TagOrderByRelationAggregateInput;
    votes?: Prisma.VoteOrderByRelationAggregateInput;
};
export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    title?: Prisma.StringFilter<"Question"> | string;
    body?: Prisma.StringFilter<"Question"> | string;
    views?: Prisma.IntFilter<"Question"> | number;
    authorId?: Prisma.StringFilter<"Question"> | string;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    answers?: Prisma.AnswerListRelationFilter;
    tags?: Prisma.TagListRelationFilter;
    votes?: Prisma.VoteListRelationFilter;
}, "id">;
export type QuestionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.QuestionCountOrderByAggregateInput;
    _avg?: Prisma.QuestionAvgOrderByAggregateInput;
    _max?: Prisma.QuestionMaxOrderByAggregateInput;
    _min?: Prisma.QuestionMinOrderByAggregateInput;
    _sum?: Prisma.QuestionSumOrderByAggregateInput;
};
export type QuestionScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    body?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    views?: Prisma.IntWithAggregatesFilter<"Question"> | number;
    authorId?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Question"> | Date | string;
};
export type QuestionCreateInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    author: Prisma.UserCreateNestedOneWithoutQuestionsInput;
    answers?: Prisma.AnswerCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    authorId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    answers?: Prisma.AnswerUncheckedCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
    answers?: Prisma.AnswerUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    answers?: Prisma.AnswerUncheckedUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionCreateManyInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    authorId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type QuestionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionListRelationFilter = {
    every?: Prisma.QuestionWhereInput;
    some?: Prisma.QuestionWhereInput;
    none?: Prisma.QuestionWhereInput;
};
export type QuestionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuestionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionAvgOrderByAggregateInput = {
    views?: Prisma.SortOrder;
};
export type QuestionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionSumOrderByAggregateInput = {
    views?: Prisma.SortOrder;
};
export type QuestionScalarRelationFilter = {
    is?: Prisma.QuestionWhereInput;
    isNot?: Prisma.QuestionWhereInput;
};
export type QuestionNullableScalarRelationFilter = {
    is?: Prisma.QuestionWhereInput | null;
    isNot?: Prisma.QuestionWhereInput | null;
};
export type QuestionCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput> | Prisma.QuestionCreateWithoutAuthorInput[] | Prisma.QuestionUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAuthorInput | Prisma.QuestionCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.QuestionCreateManyAuthorInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput> | Prisma.QuestionCreateWithoutAuthorInput[] | Prisma.QuestionUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAuthorInput | Prisma.QuestionCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.QuestionCreateManyAuthorInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput> | Prisma.QuestionCreateWithoutAuthorInput[] | Prisma.QuestionUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAuthorInput | Prisma.QuestionCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutAuthorInput | Prisma.QuestionUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.QuestionCreateManyAuthorInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutAuthorInput | Prisma.QuestionUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutAuthorInput | Prisma.QuestionUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput> | Prisma.QuestionCreateWithoutAuthorInput[] | Prisma.QuestionUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAuthorInput | Prisma.QuestionCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutAuthorInput | Prisma.QuestionUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.QuestionCreateManyAuthorInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutAuthorInput | Prisma.QuestionUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutAuthorInput | Prisma.QuestionUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionCreateNestedOneWithoutAnswersInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAnswersInput, Prisma.QuestionUncheckedCreateWithoutAnswersInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAnswersInput;
    connect?: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAnswersInput, Prisma.QuestionUncheckedCreateWithoutAnswersInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAnswersInput;
    upsert?: Prisma.QuestionUpsertWithoutAnswersInput;
    connect?: Prisma.QuestionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.QuestionUpdateToOneWithWhereWithoutAnswersInput, Prisma.QuestionUpdateWithoutAnswersInput>, Prisma.QuestionUncheckedUpdateWithoutAnswersInput>;
};
export type QuestionCreateNestedOneWithoutVotesInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutVotesInput, Prisma.QuestionUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutVotesInput;
    connect?: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateOneWithoutVotesNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutVotesInput, Prisma.QuestionUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutVotesInput;
    upsert?: Prisma.QuestionUpsertWithoutVotesInput;
    disconnect?: Prisma.QuestionWhereInput | boolean;
    delete?: Prisma.QuestionWhereInput | boolean;
    connect?: Prisma.QuestionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.QuestionUpdateToOneWithWhereWithoutVotesInput, Prisma.QuestionUpdateWithoutVotesInput>, Prisma.QuestionUncheckedUpdateWithoutVotesInput>;
};
export type QuestionCreateNestedManyWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput> | Prisma.QuestionCreateWithoutTagsInput[] | Prisma.QuestionUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutTagsInput | Prisma.QuestionCreateOrConnectWithoutTagsInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUncheckedCreateNestedManyWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput> | Prisma.QuestionCreateWithoutTagsInput[] | Prisma.QuestionUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutTagsInput | Prisma.QuestionCreateOrConnectWithoutTagsInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUpdateManyWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput> | Prisma.QuestionCreateWithoutTagsInput[] | Prisma.QuestionUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutTagsInput | Prisma.QuestionCreateOrConnectWithoutTagsInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutTagsInput | Prisma.QuestionUpsertWithWhereUniqueWithoutTagsInput[];
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutTagsInput | Prisma.QuestionUpdateWithWhereUniqueWithoutTagsInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutTagsInput | Prisma.QuestionUpdateManyWithWhereWithoutTagsInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionUncheckedUpdateManyWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput> | Prisma.QuestionCreateWithoutTagsInput[] | Prisma.QuestionUncheckedCreateWithoutTagsInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutTagsInput | Prisma.QuestionCreateOrConnectWithoutTagsInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutTagsInput | Prisma.QuestionUpsertWithWhereUniqueWithoutTagsInput[];
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutTagsInput | Prisma.QuestionUpdateWithWhereUniqueWithoutTagsInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutTagsInput | Prisma.QuestionUpdateManyWithWhereWithoutTagsInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionCreateWithoutAuthorInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    answers?: Prisma.AnswerCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateWithoutAuthorInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    answers?: Prisma.AnswerUncheckedCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionCreateOrConnectWithoutAuthorInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput>;
};
export type QuestionCreateManyAuthorInputEnvelope = {
    data: Prisma.QuestionCreateManyAuthorInput | Prisma.QuestionCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type QuestionUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.QuestionWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutAuthorInput, Prisma.QuestionUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAuthorInput, Prisma.QuestionUncheckedCreateWithoutAuthorInput>;
};
export type QuestionUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutAuthorInput, Prisma.QuestionUncheckedUpdateWithoutAuthorInput>;
};
export type QuestionUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.QuestionScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyWithoutAuthorInput>;
};
export type QuestionScalarWhereInput = {
    AND?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    OR?: Prisma.QuestionScalarWhereInput[];
    NOT?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    title?: Prisma.StringFilter<"Question"> | string;
    body?: Prisma.StringFilter<"Question"> | string;
    views?: Prisma.IntFilter<"Question"> | number;
    authorId?: Prisma.StringFilter<"Question"> | string;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
};
export type QuestionCreateWithoutAnswersInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    author: Prisma.UserCreateNestedOneWithoutQuestionsInput;
    tags?: Prisma.TagCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateWithoutAnswersInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    authorId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutQuestionsInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionCreateOrConnectWithoutAnswersInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAnswersInput, Prisma.QuestionUncheckedCreateWithoutAnswersInput>;
};
export type QuestionUpsertWithoutAnswersInput = {
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutAnswersInput, Prisma.QuestionUncheckedUpdateWithoutAnswersInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAnswersInput, Prisma.QuestionUncheckedCreateWithoutAnswersInput>;
    where?: Prisma.QuestionWhereInput;
};
export type QuestionUpdateToOneWithWhereWithoutAnswersInput = {
    where?: Prisma.QuestionWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutAnswersInput, Prisma.QuestionUncheckedUpdateWithoutAnswersInput>;
};
export type QuestionUpdateWithoutAnswersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
    tags?: Prisma.TagUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateWithoutAnswersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: Prisma.TagUncheckedUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionCreateWithoutVotesInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    author: Prisma.UserCreateNestedOneWithoutQuestionsInput;
    answers?: Prisma.AnswerCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagCreateNestedManyWithoutQuestionsInput;
};
export type QuestionUncheckedCreateWithoutVotesInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    authorId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    answers?: Prisma.AnswerUncheckedCreateNestedManyWithoutQuestionInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutQuestionsInput;
};
export type QuestionCreateOrConnectWithoutVotesInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutVotesInput, Prisma.QuestionUncheckedCreateWithoutVotesInput>;
};
export type QuestionUpsertWithoutVotesInput = {
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutVotesInput, Prisma.QuestionUncheckedUpdateWithoutVotesInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutVotesInput, Prisma.QuestionUncheckedCreateWithoutVotesInput>;
    where?: Prisma.QuestionWhereInput;
};
export type QuestionUpdateToOneWithWhereWithoutVotesInput = {
    where?: Prisma.QuestionWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutVotesInput, Prisma.QuestionUncheckedUpdateWithoutVotesInput>;
};
export type QuestionUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
    answers?: Prisma.AnswerUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUpdateManyWithoutQuestionsNestedInput;
};
export type QuestionUncheckedUpdateWithoutVotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    answers?: Prisma.AnswerUncheckedUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutQuestionsNestedInput;
};
export type QuestionCreateWithoutTagsInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    author: Prisma.UserCreateNestedOneWithoutQuestionsInput;
    answers?: Prisma.AnswerCreateNestedManyWithoutQuestionInput;
    votes?: Prisma.VoteCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateWithoutTagsInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    authorId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    answers?: Prisma.AnswerUncheckedCreateNestedManyWithoutQuestionInput;
    votes?: Prisma.VoteUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionCreateOrConnectWithoutTagsInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput>;
};
export type QuestionUpsertWithWhereUniqueWithoutTagsInput = {
    where: Prisma.QuestionWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutTagsInput, Prisma.QuestionUncheckedUpdateWithoutTagsInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutTagsInput, Prisma.QuestionUncheckedCreateWithoutTagsInput>;
};
export type QuestionUpdateWithWhereUniqueWithoutTagsInput = {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutTagsInput, Prisma.QuestionUncheckedUpdateWithoutTagsInput>;
};
export type QuestionUpdateManyWithWhereWithoutTagsInput = {
    where: Prisma.QuestionScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyWithoutTagsInput>;
};
export type QuestionCreateManyAuthorInput = {
    id?: string;
    title: string;
    body: string;
    views?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type QuestionUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    answers?: Prisma.AnswerUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    answers?: Prisma.AnswerUncheckedUpdateManyWithoutQuestionNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutQuestionsNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
    answers?: Prisma.AnswerUpdateManyWithoutQuestionNestedInput;
    votes?: Prisma.VoteUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    answers?: Prisma.AnswerUncheckedUpdateManyWithoutQuestionNestedInput;
    votes?: Prisma.VoteUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateManyWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionCountOutputType = {
    answers: number;
    tags: number;
    votes: number;
};
export type QuestionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    answers?: boolean | QuestionCountOutputTypeCountAnswersArgs;
    tags?: boolean | QuestionCountOutputTypeCountTagsArgs;
    votes?: boolean | QuestionCountOutputTypeCountVotesArgs;
};
export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionCountOutputTypeSelect<ExtArgs> | null;
};
export type QuestionCountOutputTypeCountAnswersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnswerWhereInput;
};
export type QuestionCountOutputTypeCountTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
};
export type QuestionCountOutputTypeCountVotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
};
export type QuestionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    body?: boolean;
    views?: boolean;
    authorId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    answers?: boolean | Prisma.Question$answersArgs<ExtArgs>;
    tags?: boolean | Prisma.Question$tagsArgs<ExtArgs>;
    votes?: boolean | Prisma.Question$votesArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    body?: boolean;
    views?: boolean;
    authorId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    body?: boolean;
    views?: boolean;
    authorId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectScalar = {
    id?: boolean;
    title?: boolean;
    body?: boolean;
    views?: boolean;
    authorId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type QuestionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "body" | "views" | "authorId" | "createdAt" | "updatedAt", ExtArgs["result"]["question"]>;
export type QuestionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    answers?: boolean | Prisma.Question$answersArgs<ExtArgs>;
    tags?: boolean | Prisma.Question$tagsArgs<ExtArgs>;
    votes?: boolean | Prisma.Question$votesArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type QuestionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $QuestionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Question";
    objects: {
        author: Prisma.$UserPayload<ExtArgs>;
        answers: Prisma.$AnswerPayload<ExtArgs>[];
        tags: Prisma.$TagPayload<ExtArgs>[];
        votes: Prisma.$VotePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        body: string;
        views: number;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["question"]>;
    composites: {};
};
export type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestionPayload, S>;
export type QuestionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionCountAggregateInputType | true;
};
export interface QuestionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Question'];
        meta: {
            name: 'Question';
        };
    };
    findUnique<T extends QuestionFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuestionFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuestionFindManyArgs>(args?: Prisma.SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuestionCreateArgs>(args: Prisma.SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuestionCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuestionDeleteArgs>(args: Prisma.SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuestionUpdateArgs>(args: Prisma.SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuestionDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuestionUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuestionUpsertArgs>(args: Prisma.SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuestionCountArgs>(args?: Prisma.Subset<T, QuestionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionCountAggregateOutputType> : number>;
    aggregate<T extends QuestionAggregateArgs>(args: Prisma.Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>;
    groupBy<T extends QuestionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestionGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestionGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuestionFieldRefs;
}
export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    answers<T extends Prisma.Question$answersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Question$answersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tags<T extends Prisma.Question$tagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Question$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    votes<T extends Prisma.Question$votesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Question$votesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuestionFieldRefs {
    readonly id: Prisma.FieldRef<"Question", 'String'>;
    readonly title: Prisma.FieldRef<"Question", 'String'>;
    readonly body: Prisma.FieldRef<"Question", 'String'>;
    readonly views: Prisma.FieldRef<"Question", 'Int'>;
    readonly authorId: Prisma.FieldRef<"Question", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Question", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Question", 'DateTime'>;
}
export type QuestionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
};
export type QuestionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.QuestionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type QuestionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
    include?: Prisma.QuestionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
};
export type QuestionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type Question$answersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnswerSelect<ExtArgs> | null;
    omit?: Prisma.AnswerOmit<ExtArgs> | null;
    include?: Prisma.AnswerInclude<ExtArgs> | null;
    where?: Prisma.AnswerWhereInput;
    orderBy?: Prisma.AnswerOrderByWithRelationInput | Prisma.AnswerOrderByWithRelationInput[];
    cursor?: Prisma.AnswerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnswerScalarFieldEnum | Prisma.AnswerScalarFieldEnum[];
};
export type Question$tagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type Question$votesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithRelationInput | Prisma.VoteOrderByWithRelationInput[];
    cursor?: Prisma.VoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VoteScalarFieldEnum | Prisma.VoteScalarFieldEnum[];
};
export type QuestionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
};
export {};
