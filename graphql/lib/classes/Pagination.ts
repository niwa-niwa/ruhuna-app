import { PrismaPromise, User, Village, Message } from "@prisma/client";
import { Connection, Edge, Node, NodesArgs } from "../../../types/types.d";

export class Pagination {
  protected readonly MAX_ITEMS: number = 250;

  constructor(
    protected readonly client: {
      findMany: ({}) => PrismaPromise<User[] | Village[] | Message[]>;
      count: ({}) => PrismaPromise<number>;
    }
  ) {}

  public async getConnection({
    after = undefined,
    before = undefined,
    first = undefined,
    last = undefined,
    query = undefined,
    reverse = false,
    sortKey = "updatedAt",
  }: NodesArgs): Promise<Connection> {
    if (first !== undefined && last !== undefined) {
      throw new Error(
        "Passing both `first` and `last` to paginate the connection is not supported."
      );
    }

    // default variable, if first & last are empty
    if (first === undefined && last === undefined) {
      first = 10;
    }

    // parse arguments for PrismaJS
    const {
      where,
      orderBy,
      cursor,
      take,
      skip,
    }: {
      where: { [key: string | number]: string | number } | undefined;
      orderBy: { [key: string]: string };
      cursor: { [key: string]: string } | undefined;
      take: number;
      skip: number | undefined;
    } = (() => {
      const where: { [key: string | number]: string | number } | undefined =
        query ? JSON.parse(query) : undefined;

      // for excepting the cursor
      const skip: number | undefined = after || before ? 1 : undefined;
      if (first !== undefined) {
        const orderBy: { [key: string]: string } = {
          [sortKey + ""]: reverse ? "desc" : "asc",
        };

        const cursor: { [key: string]: string } | undefined = after
          ? { id: after }
          : undefined;

        const take: number = first || 10;

        return { where, orderBy, cursor, take, skip };
      }

      if (last !== undefined) {
        // it's purposely, the array will be reversed order after extracting
        const orderBy: { [key: string]: string } = {
          [sortKey + ""]: reverse ? "asc" : "desc",
        };

        const cursor: { [key: string]: string } | undefined = before
          ? { id: before }
          : undefined;

        const take: number = last || 10;

        return { where, orderBy, cursor, take, skip };
      }

      throw new Error("The request is illegally parameters");
    })();

    if (take > this.MAX_ITEMS)
      throw new Error("an array have a maximum size of 250");

    // extract and generate response values
    const {
      nodes,
      hasNextPage,
      hasPreviousPage,
    }: {
      nodes: Node[];
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    } = await (async () => {
      try {
        const nodes: Node[] = await this.client.findMany({
          where,
          take: take + 1, // confirm next page exist
          skip,
          cursor,
          orderBy,
        });

        const hasPreviousPage: boolean = !!skip;

        const hasNextPage: boolean = nodes.length <= take ? false : true;

        // remove last value because increase array length to confirm next page exist
        if (hasNextPage) nodes.pop();

        // respect request orderBy
        if (last) nodes.reverse();

        return {
          nodes,
          hasNextPage,
          hasPreviousPage,
        };
      } catch (e) {
        console.error(e);
        throw new Error("Something is wrong");
      }
    })();

    const totalCount: number = await this.client.count({ where });

    const edges: Edge[] = nodes.map((node: Node) => {
      return {
        node: node,
        cursor: node.id,
      };
    });

    const startCursor: string | null = nodes[0]?.id ?? null;

    const endCursor: string | null = nodes[nodes.length - 1]?.id ?? null;

    return {
      totalCount,
      nodes,
      edges,
      pageInfo: {
        startCursor,
        endCursor,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
