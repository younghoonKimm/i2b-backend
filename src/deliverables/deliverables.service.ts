import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeliverablesEntity } from "./entitiy/deliverables.entitiy";
import { Repository } from "typeorm";

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectRepository(DeliverablesEntity)
    private readonly deliverables: Repository<DeliverablesEntity>,
  ) {}

  async getDeliverables() {
    return await this.deliverables.find();
  }

  async postDeliverables() {
    return this.deliverables.findOne({ id: "asdsa" });
  }

  async setDeliverableLists() {
    return await this.deliverables.save({
      deliverable: "신규 구축",
      deliverablesLists: [
        {
          parentSeqNo: "dsfsdfsd",
          checkedNames: ["UI/UX"],
        },
      ],
    });
  }
}
