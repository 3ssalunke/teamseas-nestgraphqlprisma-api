import { Resolver, Query, Mutation, Args, Subscription } from "@nestjs/graphql";
import { DonationCreateInput } from "src/@generated/prisma-nestjs-graphql/donation/donation-create.input";
import { OrderByParams } from "src/graphql";
import { DonationsService } from "./donations.service";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

@Resolver("Donation")
export class DonationsResolver {
  constructor(private readonly donationsService: DonationsService) {}

  @Mutation("createDonation")
  async create(
    @Args("createDonationInput") createDonationInput: DonationCreateInput
  ) {
    const created = await this.donationsService.create(createDonationInput);
    const total = await this.donationsService.getTotal();
    pubsub.publish("totalUpdated", { totalUpdated: { total } });
    return created;
  }

  @Subscription("totalUpdated")
  totalUpdated() {
    return pubsub.asyncIterator("totalUpdated");
  }

  @Query("donations")
  findAll(@Args("orderBy") orderBy?: OrderByParams) {
    return this.donationsService.findAll(orderBy);
  }

  @Query("donation")
  findOne(@Args("id") id: number) {
    return this.donationsService.findOne({ id });
  }

  @Query("totalDonations")
  totalDonations() {
    return this.donationsService.getTotal();
  }
}
