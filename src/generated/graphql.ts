import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type Brand = {
  __typename?: 'Brand';
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  TAX: Scalars['Float']['output'];
  amount: Scalars['Float']['output'];
  orderId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  quantity: Scalars['Int']['output'];
};

export type CartItemInput = {
  amount: Scalars['Int']['input'];
  orderId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  productsCount?: Maybe<Scalars['Int']['output']>;
  urlImage?: Maybe<Scalars['String']['output']>;
};

export type CreateUserInput = {
  VATIN?: InputMaybe<Scalars['String']['input']>;
  access?: InputMaybe<Scalars['Boolean']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type FacturaInput = {
  lines: Array<OrderLines>;
  orderId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addProductToWishes: User;
  brandsUpdate: Scalars['JSON']['output'];
  createOrder: Order;
  createProductsFromFacturaDirecta: Scalars['String']['output'];
  createUser: User;
  loginUser: UserAuthResponse;
  logoutUser: Scalars['JSON']['output'];
  recoveryPassword: Scalars['ID']['output'];
  removeOrderById: Scalars['JSON']['output'];
  sendFacturaDirectaOrder: Scalars['JSON']['output'];
  signUp: UserAuthResponse;
  updateUser: User;
};


export type MutationAddProductToWishesArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationCreateOrderArgs = {
  input: OrderInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRecoveryPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveOrderByIdArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationSendFacturaDirectaOrderArgs = {
  input: FacturaInput;
};


export type MutationSignUpArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Order = {
  __typename?: 'Order';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  products: Array<CartItem>;
  refund: Scalars['Boolean']['output'];
  status: OrderStatus;
  updatedAt: Scalars['String']['output'];
  uuid: Scalars['ID']['output'];
};

export type OrderInput = {
  products: Array<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};

export type OrderLines = {
  account?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  tax?: InputMaybe<Array<InputMaybe<Tax>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export enum OrderStatus {
  Autorizado = 'AUTORIZADO',
  Cancelada = 'CANCELADA',
  Completada = 'COMPLETADA',
  Fallo = 'FALLO',
  Pendiente = 'PENDIENTE'
}

export type Product = {
  __typename?: 'Product';
  accessories?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  brand?: Maybe<Brand>;
  categoryId: Category;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imagen?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
  urlImage?: Maybe<Scalars['String']['output']>;
  urlMoreInfo?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['ID']['output']>;
  wishes?: Maybe<Array<Maybe<User>>>;
};

export type ProductInput = {
  accessories?: InputMaybe<Scalars['String']['input']>;
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  stock: Scalars['Int']['input'];
  urlImage?: InputMaybe<Scalars['String']['input']>;
  urlMoreInfo?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAllBrands?: Maybe<Array<Maybe<Brand>>>;
  getAllCategories: Array<Category>;
  getAllOrders?: Maybe<Array<Order>>;
  getAllProducts: Array<Product>;
  getCategoryById: Category;
  getInvoices?: Maybe<Scalars['JSON']['output']>;
  getInvoicesById?: Maybe<Scalars['JSON']['output']>;
  getMyOrders?: Maybe<Array<Order>>;
  getOrderById: Order;
  getProductById: Product;
  getProductsByCategory: Array<Product>;
  getUser?: Maybe<User>;
  me?: Maybe<User>;
  searchProductsByText?: Maybe<Array<Maybe<Product>>>;
};


export type QueryGetAllCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInvoicesByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductsByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchProductsByTextArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export enum ResponseStatus {
  Ko = 'KO',
  Ok = 'OK'
}

export enum Role {
  Admin = 'ADMIN',
  Instalador = 'INSTALADOR'
}

export enum Tax {
  SIgic_7 = 'S_IGIC_7',
  SIva_21 = 'S_IVA_21'
}

export enum TokenState {
  Recovery = 'RECOVERY',
  SignIn = 'SIGN_IN'
}

export type UpdateUserInput = {
  VATIN?: InputMaybe<Scalars['String']['input']>;
  access?: InputMaybe<Scalars['Boolean']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  VATIN?: Maybe<Scalars['String']['output']>;
  access: Scalars['Boolean']['output'];
  address?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orders?: Maybe<Array<Maybe<Order>>>;
  password: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: Role;
  token?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  uuid?: Maybe<Scalars['ID']['output']>;
  wishes?: Maybe<Array<Maybe<Product>>>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type UserAuthResponse = {
  __typename?: 'UserAuthResponse';
  error?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type UserToken = {
  __typename?: 'UserToken';
  createdAt: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  token: Scalars['String']['output'];
  type: TokenState;
  user: Scalars['ID']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Brand: ResolverTypeWrapper<Brand>;
  CartItem: ResolverTypeWrapper<CartItem>;
  CartItemInput: CartItemInput;
  Category: ResolverTypeWrapper<Category>;
  CreateUserInput: CreateUserInput;
  FacturaInput: FacturaInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderInput: OrderInput;
  OrderLines: OrderLines;
  OrderStatus: OrderStatus;
  Product: ResolverTypeWrapper<Product>;
  ProductInput: ProductInput;
  Query: ResolverTypeWrapper<{}>;
  ResponseStatus: ResponseStatus;
  Role: Role;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TAX: Tax;
  TokenState: TokenState;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserAuthResponse: ResolverTypeWrapper<UserAuthResponse>;
  UserToken: ResolverTypeWrapper<UserToken>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Brand: Brand;
  CartItem: CartItem;
  CartItemInput: CartItemInput;
  Category: Category;
  CreateUserInput: CreateUserInput;
  FacturaInput: FacturaInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Order: Order;
  OrderInput: OrderInput;
  OrderLines: OrderLines;
  Product: Product;
  ProductInput: ProductInput;
  Query: {};
  String: Scalars['String']['output'];
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserAuthResponse: UserAuthResponse;
  UserToken: UserToken;
}>;

export type BrandResolvers<ContextType = any, ParentType extends ResolversParentTypes['Brand'] = ResolversParentTypes['Brand']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = ResolversObject<{
  TAX?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productsCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  urlImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addProductToWishes?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAddProductToWishesArgs, 'productId'>>;
  brandsUpdate?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createProductsFromFacturaDirecta?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  loginUser?: Resolver<ResolversTypes['UserAuthResponse'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'email' | 'password'>>;
  logoutUser?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  recoveryPassword?: Resolver<ResolversTypes['ID'], ParentType, ContextType, Partial<MutationRecoveryPasswordArgs>>;
  removeOrderById?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationRemoveOrderByIdArgs, 'orderId'>>;
  sendFacturaDirectaOrder?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationSendFacturaDirectaOrderArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['UserAuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
}>;

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['CartItem']>, ParentType, ContextType>;
  refund?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  accessories?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['Brand']>, ParentType, ContextType>;
  categoryId?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imagen?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  urlImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  urlMoreInfo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  wishes?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAllBrands?: Resolver<Maybe<Array<Maybe<ResolversTypes['Brand']>>>, ParentType, ContextType>;
  getAllCategories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryGetAllCategoriesArgs>>;
  getAllOrders?: Resolver<Maybe<Array<ResolversTypes['Order']>>, ParentType, ContextType>;
  getAllProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  getCategoryById?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QueryGetCategoryByIdArgs, 'id'>>;
  getInvoices?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  getInvoicesById?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryGetInvoicesByIdArgs, 'id'>>;
  getMyOrders?: Resolver<Maybe<Array<ResolversTypes['Order']>>, ParentType, ContextType>;
  getOrderById?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<QueryGetOrderByIdArgs, 'id'>>;
  getProductById?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<QueryGetProductByIdArgs, 'id'>>;
  getProductsByCategory?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryGetProductsByCategoryArgs, 'categoryId'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  searchProductsByText?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType, Partial<QuerySearchProductsByTextArgs>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  VATIN?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  access?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  businessName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  wishes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAuthResponse'] = ResolversParentTypes['UserAuthResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TokenState'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Brand?: BrandResolvers<ContextType>;
  CartItem?: CartItemResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAuthResponse?: UserAuthResponseResolvers<ContextType>;
  UserToken?: UserTokenResolvers<ContextType>;
}>;

