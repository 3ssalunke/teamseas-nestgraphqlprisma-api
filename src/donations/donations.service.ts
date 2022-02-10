import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { DonationCreateInput } from "src/@generated/prisma-nestjs-graphql/donation/donation-create.input";
import { DonationWhereUniqueInput } from "src/@generated/prisma-nestjs-graphql/donation/donation-where-unique.input";
import { OrderByParams } from "src/graphql";

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  create(createDonationInput: DonationCreateInput) {
    return this.prisma.donation.create({
      data: createDonationInput,
    });
  }

  findAll(orderBy?: OrderByParams) {
    const { field = "createdAt", direction = "desc" } = orderBy || {};
    return this.prisma.donation.findMany({
      orderBy: { [field]: direction },
    });
  }

  findOne(donationWhereUniqueInput: DonationWhereUniqueInput) {
    return this.prisma.donation.findUnique({
      where: donationWhereUniqueInput,
    });
  }

  async getTotal() {
    const res = await this.prisma.donation.aggregate({
      _sum: {
        count: true,
      },
    });
    return res._sum.count;
  }
}
