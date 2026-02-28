import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type VoteModel = runtime.Types.Result.DefaultSelection<Prisma.$VotePayload>;
export type AggregateVote = {
    _count: VoteCountAggregateOutputType | null;
    _min: VoteMinAggregateOutputType | null;
    _max: VoteMaxAggregateOutputType | null;
};
export type VoteMinAggregateOutputType = {
    id: string | null;
    type: $Enums.VoteType | null;
    userId: string | null;
    questionId: string | null;
    answerId: string | null;
    createdAt: Date | null;
};
export type VoteMaxAggregateOutputType = {
    id: string | null;
    type: $Enums.VoteType | null;
    userId: string | null;
    questionId: string | null;
    answerId: string | null;
    createdAt: Date | null;
};
export type VoteCountAggregateOutputType = {
    id: number;
    type: number;
    userId: number;
    questionId: number;
    answerId: number;
    createdAt: number;
    _all: number;
};
export type VoteMinAggregateInputType = {
    id?: true;
    type?: true;
    userId?: true;
    questionId?: true;
    answerId?: true;
    createdAt?: true;
};
export type VoteMaxAggregateInputType = {
    id?: true;
    type?: true;
    userId?: true;
    questionId?: true;
    answerId?: true;
    createdAt?: true;
};
export type VoteCountAggregateInputType = {
    id?: true;
    type?: true;
    userId?: true;
    questionId?: true;
    answerId?: true;
    createdAt?: true;
    _all?: true;
};
export type VoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithRelationInput | Prisma.VoteOrderByWithRelationInput[];
    cursor?: Prisma.VoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VoteCountAggregateInputType;
    _min?: VoteMinAggregateInputType;
    _max?: VoteMaxAggregateInputType;
};
export type GetVoteAggregateType<T extends VoteAggregateArgs> = {
    [P in keyof T & keyof AggregateVote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVote[P]> : Prisma.GetScalarType<T[P], AggregateVote[P]>;
};
export type VoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithAggregationInput | Prisma.VoteOrderByWithAggregationInput[];
    by: Prisma.VoteScalarFieldEnum[] | Prisma.VoteScalarFieldEnum;
    having?: Prisma.VoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VoteCountAggregateInputType | true;
    _min?: VoteMinAggregateInputType;
    _max?: VoteMaxAggregateInputType;
};
export type VoteGroupByOutputType = {
    id: string;
    type: $Enums.VoteType;
    userId: string;
    questionId: string | null;
    answerId: string | null;
    createdAt: Date;
    _count: VoteCountAggregateOutputType | null;
    _min: VoteMinAggregateOutputType | null;
    _max: VoteMaxAggregateOutputType | null;
};
type GetVoteGroupByPayload<T extends VoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VoteGroupByOutputType[P]>;
}>>;
export type VoteWhereInput = {
    AND?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    OR?: Prisma.VoteWhereInput[];
    NOT?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    id?: Prisma.StringFilter<"Vote"> | string;
    type?: Prisma.EnumVoteTypeFilter<"Vote"> | $Enums.VoteType;
    userId?: Prisma.StringFilter<"Vote"> | string;
    questionId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    answerId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Vote"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionNullableScalarRelationFilter, Prisma.QuestionWhereInput> | null;
    answer?: Prisma.XOR<Prisma.AnswerNullableScalarRelationFilter, Prisma.AnswerWhereInput> | null;
};
export type VoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    answerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    question?: Prisma.QuestionOrderByWithRelationInput;
    answer?: Prisma.AnswerOrderByWithRelationInput;
};
export type VoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_questionId?: Prisma.VoteUserIdQuestionIdCompoundUniqueInput;
    userId_answerId?: Prisma.VoteUserIdAnswerIdCompoundUniqueInput;
    AND?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    OR?: Prisma.VoteWhereInput[];
    NOT?: Prisma.VoteWhereInput | Prisma.VoteWhereInput[];
    type?: Prisma.EnumVoteTypeFilter<"Vote"> | $Enums.VoteType;
    userId?: Prisma.StringFilter<"Vote"> | string;
    questionId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    answerId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Vote"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionNullableScalarRelationFilter, Prisma.QuestionWhereInput> | null;
    answer?: Prisma.XOR<Prisma.AnswerNullableScalarRelationFilter, Prisma.AnswerWhereInput> | null;
}, "id" | "userId_questionId" | "userId_answerId">;
export type VoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    answerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.VoteCountOrderByAggregateInput;
    _max?: Prisma.VoteMaxOrderByAggregateInput;
    _min?: Prisma.VoteMinOrderByAggregateInput;
};
export type VoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.VoteScalarWhereWithAggregatesInput | Prisma.VoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.VoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VoteScalarWhereWithAggregatesInput | Prisma.VoteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Vote"> | string;
    type?: Prisma.EnumVoteTypeWithAggregatesFilter<"Vote"> | $Enums.VoteType;
    userId?: Prisma.StringWithAggregatesFilter<"Vote"> | string;
    questionId?: Prisma.StringNullableWithAggregatesFilter<"Vote"> | string | null;
    answerId?: Prisma.StringNullableWithAggregatesFilter<"Vote"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Vote"> | Date | string;
};
export type VoteCreateInput = {
    id?: string;
    type: $Enums.VoteType;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutVotesInput;
    question?: Prisma.QuestionCreateNestedOneWithoutVotesInput;
    answer?: Prisma.AnswerCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    questionId?: string | null;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutVotesNestedInput;
    question?: Prisma.QuestionUpdateOneWithoutVotesNestedInput;
    answer?: Prisma.AnswerUpdateOneWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteCreateManyInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    questionId?: string | null;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteListRelationFilter = {
    every?: Prisma.VoteWhereInput;
    some?: Prisma.VoteWhereInput;
    none?: Prisma.VoteWhereInput;
};
export type VoteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VoteUserIdQuestionIdCompoundUniqueInput = {
    userId: string;
    questionId: string;
};
export type VoteUserIdAnswerIdCompoundUniqueInput = {
    userId: string;
    answerId: string;
};
export type VoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    answerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    answerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    answerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VoteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput> | Prisma.VoteCreateWithoutUserInput[] | Prisma.VoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutUserInput | Prisma.VoteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.VoteCreateManyUserInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput> | Prisma.VoteCreateWithoutUserInput[] | Prisma.VoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutUserInput | Prisma.VoteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.VoteCreateManyUserInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput> | Prisma.VoteCreateWithoutUserInput[] | Prisma.VoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutUserInput | Prisma.VoteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutUserInput | Prisma.VoteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.VoteCreateManyUserInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutUserInput | Prisma.VoteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutUserInput | Prisma.VoteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput> | Prisma.VoteCreateWithoutUserInput[] | Prisma.VoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutUserInput | Prisma.VoteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutUserInput | Prisma.VoteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.VoteCreateManyUserInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutUserInput | Prisma.VoteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutUserInput | Prisma.VoteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput> | Prisma.VoteCreateWithoutQuestionInput[] | Prisma.VoteUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutQuestionInput | Prisma.VoteCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.VoteCreateManyQuestionInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput> | Prisma.VoteCreateWithoutQuestionInput[] | Prisma.VoteUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutQuestionInput | Prisma.VoteCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.VoteCreateManyQuestionInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput> | Prisma.VoteCreateWithoutQuestionInput[] | Prisma.VoteUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutQuestionInput | Prisma.VoteCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutQuestionInput | Prisma.VoteUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.VoteCreateManyQuestionInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutQuestionInput | Prisma.VoteUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutQuestionInput | Prisma.VoteUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput> | Prisma.VoteCreateWithoutQuestionInput[] | Prisma.VoteUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutQuestionInput | Prisma.VoteCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutQuestionInput | Prisma.VoteUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.VoteCreateManyQuestionInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutQuestionInput | Prisma.VoteUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutQuestionInput | Prisma.VoteUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteCreateNestedManyWithoutAnswerInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput> | Prisma.VoteCreateWithoutAnswerInput[] | Prisma.VoteUncheckedCreateWithoutAnswerInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutAnswerInput | Prisma.VoteCreateOrConnectWithoutAnswerInput[];
    createMany?: Prisma.VoteCreateManyAnswerInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUncheckedCreateNestedManyWithoutAnswerInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput> | Prisma.VoteCreateWithoutAnswerInput[] | Prisma.VoteUncheckedCreateWithoutAnswerInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutAnswerInput | Prisma.VoteCreateOrConnectWithoutAnswerInput[];
    createMany?: Prisma.VoteCreateManyAnswerInputEnvelope;
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
};
export type VoteUpdateManyWithoutAnswerNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput> | Prisma.VoteCreateWithoutAnswerInput[] | Prisma.VoteUncheckedCreateWithoutAnswerInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutAnswerInput | Prisma.VoteCreateOrConnectWithoutAnswerInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutAnswerInput | Prisma.VoteUpsertWithWhereUniqueWithoutAnswerInput[];
    createMany?: Prisma.VoteCreateManyAnswerInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutAnswerInput | Prisma.VoteUpdateWithWhereUniqueWithoutAnswerInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutAnswerInput | Prisma.VoteUpdateManyWithWhereWithoutAnswerInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type VoteUncheckedUpdateManyWithoutAnswerNestedInput = {
    create?: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput> | Prisma.VoteCreateWithoutAnswerInput[] | Prisma.VoteUncheckedCreateWithoutAnswerInput[];
    connectOrCreate?: Prisma.VoteCreateOrConnectWithoutAnswerInput | Prisma.VoteCreateOrConnectWithoutAnswerInput[];
    upsert?: Prisma.VoteUpsertWithWhereUniqueWithoutAnswerInput | Prisma.VoteUpsertWithWhereUniqueWithoutAnswerInput[];
    createMany?: Prisma.VoteCreateManyAnswerInputEnvelope;
    set?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    disconnect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    delete?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    connect?: Prisma.VoteWhereUniqueInput | Prisma.VoteWhereUniqueInput[];
    update?: Prisma.VoteUpdateWithWhereUniqueWithoutAnswerInput | Prisma.VoteUpdateWithWhereUniqueWithoutAnswerInput[];
    updateMany?: Prisma.VoteUpdateManyWithWhereWithoutAnswerInput | Prisma.VoteUpdateManyWithWhereWithoutAnswerInput[];
    deleteMany?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
};
export type EnumVoteTypeFieldUpdateOperationsInput = {
    set?: $Enums.VoteType;
};
export type VoteCreateWithoutUserInput = {
    id?: string;
    type: $Enums.VoteType;
    createdAt?: Date | string;
    question?: Prisma.QuestionCreateNestedOneWithoutVotesInput;
    answer?: Prisma.AnswerCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateWithoutUserInput = {
    id?: string;
    type: $Enums.VoteType;
    questionId?: string | null;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteCreateOrConnectWithoutUserInput = {
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput>;
};
export type VoteCreateManyUserInputEnvelope = {
    data: Prisma.VoteCreateManyUserInput | Prisma.VoteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type VoteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.VoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.VoteUpdateWithoutUserInput, Prisma.VoteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.VoteCreateWithoutUserInput, Prisma.VoteUncheckedCreateWithoutUserInput>;
};
export type VoteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.VoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.VoteUpdateWithoutUserInput, Prisma.VoteUncheckedUpdateWithoutUserInput>;
};
export type VoteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.VoteScalarWhereInput;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyWithoutUserInput>;
};
export type VoteScalarWhereInput = {
    AND?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
    OR?: Prisma.VoteScalarWhereInput[];
    NOT?: Prisma.VoteScalarWhereInput | Prisma.VoteScalarWhereInput[];
    id?: Prisma.StringFilter<"Vote"> | string;
    type?: Prisma.EnumVoteTypeFilter<"Vote"> | $Enums.VoteType;
    userId?: Prisma.StringFilter<"Vote"> | string;
    questionId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    answerId?: Prisma.StringNullableFilter<"Vote"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Vote"> | Date | string;
};
export type VoteCreateWithoutQuestionInput = {
    id?: string;
    type: $Enums.VoteType;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutVotesInput;
    answer?: Prisma.AnswerCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateWithoutQuestionInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteCreateOrConnectWithoutQuestionInput = {
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput>;
};
export type VoteCreateManyQuestionInputEnvelope = {
    data: Prisma.VoteCreateManyQuestionInput | Prisma.VoteCreateManyQuestionInput[];
    skipDuplicates?: boolean;
};
export type VoteUpsertWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.VoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.VoteUpdateWithoutQuestionInput, Prisma.VoteUncheckedUpdateWithoutQuestionInput>;
    create: Prisma.XOR<Prisma.VoteCreateWithoutQuestionInput, Prisma.VoteUncheckedCreateWithoutQuestionInput>;
};
export type VoteUpdateWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.VoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.VoteUpdateWithoutQuestionInput, Prisma.VoteUncheckedUpdateWithoutQuestionInput>;
};
export type VoteUpdateManyWithWhereWithoutQuestionInput = {
    where: Prisma.VoteScalarWhereInput;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyWithoutQuestionInput>;
};
export type VoteCreateWithoutAnswerInput = {
    id?: string;
    type: $Enums.VoteType;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutVotesInput;
    question?: Prisma.QuestionCreateNestedOneWithoutVotesInput;
};
export type VoteUncheckedCreateWithoutAnswerInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    questionId?: string | null;
    createdAt?: Date | string;
};
export type VoteCreateOrConnectWithoutAnswerInput = {
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput>;
};
export type VoteCreateManyAnswerInputEnvelope = {
    data: Prisma.VoteCreateManyAnswerInput | Prisma.VoteCreateManyAnswerInput[];
    skipDuplicates?: boolean;
};
export type VoteUpsertWithWhereUniqueWithoutAnswerInput = {
    where: Prisma.VoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.VoteUpdateWithoutAnswerInput, Prisma.VoteUncheckedUpdateWithoutAnswerInput>;
    create: Prisma.XOR<Prisma.VoteCreateWithoutAnswerInput, Prisma.VoteUncheckedCreateWithoutAnswerInput>;
};
export type VoteUpdateWithWhereUniqueWithoutAnswerInput = {
    where: Prisma.VoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.VoteUpdateWithoutAnswerInput, Prisma.VoteUncheckedUpdateWithoutAnswerInput>;
};
export type VoteUpdateManyWithWhereWithoutAnswerInput = {
    where: Prisma.VoteScalarWhereInput;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyWithoutAnswerInput>;
};
export type VoteCreateManyUserInput = {
    id?: string;
    type: $Enums.VoteType;
    questionId?: string | null;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    question?: Prisma.QuestionUpdateOneWithoutVotesNestedInput;
    answer?: Prisma.AnswerUpdateOneWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteCreateManyQuestionInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    answerId?: string | null;
    createdAt?: Date | string;
};
export type VoteUpdateWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutVotesNestedInput;
    answer?: Prisma.AnswerUpdateOneWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    answerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteCreateManyAnswerInput = {
    id?: string;
    type: $Enums.VoteType;
    userId: string;
    questionId?: string | null;
    createdAt?: Date | string;
};
export type VoteUpdateWithoutAnswerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutVotesNestedInput;
    question?: Prisma.QuestionUpdateOneWithoutVotesNestedInput;
};
export type VoteUncheckedUpdateWithoutAnswerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteUncheckedUpdateManyWithoutAnswerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumVoteTypeFieldUpdateOperationsInput | $Enums.VoteType;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    userId?: boolean;
    questionId?: boolean;
    answerId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    userId?: boolean;
    questionId?: boolean;
    answerId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    userId?: boolean;
    questionId?: boolean;
    answerId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
}, ExtArgs["result"]["vote"]>;
export type VoteSelectScalar = {
    id?: boolean;
    type?: boolean;
    userId?: boolean;
    questionId?: boolean;
    answerId?: boolean;
    createdAt?: boolean;
};
export type VoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "type" | "userId" | "questionId" | "answerId" | "createdAt", ExtArgs["result"]["vote"]>;
export type VoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
};
export type VoteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
};
export type VoteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.Vote$questionArgs<ExtArgs>;
    answer?: boolean | Prisma.Vote$answerArgs<ExtArgs>;
};
export type $VotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Vote";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        question: Prisma.$QuestionPayload<ExtArgs> | null;
        answer: Prisma.$AnswerPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        type: $Enums.VoteType;
        userId: string;
        questionId: string | null;
        answerId: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["vote"]>;
    composites: {};
};
export type VoteGetPayload<S extends boolean | null | undefined | VoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VotePayload, S>;
export type VoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VoteCountAggregateInputType | true;
};
export interface VoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Vote'];
        meta: {
            name: 'Vote';
        };
    };
    findUnique<T extends VoteFindUniqueArgs>(args: Prisma.SelectSubset<T, VoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VoteFindFirstArgs>(args?: Prisma.SelectSubset<T, VoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VoteFindManyArgs>(args?: Prisma.SelectSubset<T, VoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VoteCreateArgs>(args: Prisma.SelectSubset<T, VoteCreateArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VoteCreateManyArgs>(args?: Prisma.SelectSubset<T, VoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VoteDeleteArgs>(args: Prisma.SelectSubset<T, VoteDeleteArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VoteUpdateArgs>(args: Prisma.SelectSubset<T, VoteUpdateArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, VoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VoteUpdateManyArgs>(args: Prisma.SelectSubset<T, VoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VoteUpsertArgs>(args: Prisma.SelectSubset<T, VoteUpsertArgs<ExtArgs>>): Prisma.Prisma__VoteClient<runtime.Types.Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VoteCountArgs>(args?: Prisma.Subset<T, VoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VoteCountAggregateOutputType> : number>;
    aggregate<T extends VoteAggregateArgs>(args: Prisma.Subset<T, VoteAggregateArgs>): Prisma.PrismaPromise<GetVoteAggregateType<T>>;
    groupBy<T extends VoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VoteGroupByArgs['orderBy'];
    } : {
        orderBy?: VoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VoteFieldRefs;
}
export interface Prisma__VoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    question<T extends Prisma.Vote$questionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vote$questionArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    answer<T extends Prisma.Vote$answerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vote$answerArgs<ExtArgs>>): Prisma.Prisma__AnswerClient<runtime.Types.Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VoteFieldRefs {
    readonly id: Prisma.FieldRef<"Vote", 'String'>;
    readonly type: Prisma.FieldRef<"Vote", 'VoteType'>;
    readonly userId: Prisma.FieldRef<"Vote", 'String'>;
    readonly questionId: Prisma.FieldRef<"Vote", 'String'>;
    readonly answerId: Prisma.FieldRef<"Vote", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Vote", 'DateTime'>;
}
export type VoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteCreateInput, Prisma.VoteUncheckedCreateInput>;
};
export type VoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VoteCreateManyInput | Prisma.VoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    data: Prisma.VoteCreateManyInput | Prisma.VoteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VoteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteUpdateInput, Prisma.VoteUncheckedUpdateInput>;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyInput>;
    where?: Prisma.VoteWhereInput;
    limit?: number;
};
export type VoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VoteUpdateManyMutationInput, Prisma.VoteUncheckedUpdateManyInput>;
    where?: Prisma.VoteWhereInput;
    limit?: number;
    include?: Prisma.VoteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.VoteCreateInput, Prisma.VoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VoteUpdateInput, Prisma.VoteUncheckedUpdateInput>;
};
export type VoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
    where: Prisma.VoteWhereUniqueInput;
};
export type VoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VoteWhereInput;
    limit?: number;
};
export type Vote$questionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
};
export type Vote$answerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnswerSelect<ExtArgs> | null;
    omit?: Prisma.AnswerOmit<ExtArgs> | null;
    include?: Prisma.AnswerInclude<ExtArgs> | null;
    where?: Prisma.AnswerWhereInput;
};
export type VoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VoteSelect<ExtArgs> | null;
    omit?: Prisma.VoteOmit<ExtArgs> | null;
    include?: Prisma.VoteInclude<ExtArgs> | null;
};
export {};
