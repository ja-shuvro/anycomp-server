import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { Specialist } from "./Specialist.entity";
import { ServiceOfferingsMasterList } from "./ServiceOfferingsMasterList.entity";

/**
 * Service Offering Entity
 * Junction table connecting specialists to service offerings
 */
@Entity("service_offerings")
@Index(["specialists"])
@Index(["serviceOfferingsMasterListId"])
export class ServiceOffering {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", name: "specialists" })
    specialists: string;

    @Column({ type: "uuid", name: "service_offerings_master_list_id" })
    serviceOfferingsMasterListId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Specialist, (specialist) => specialist.serviceOfferings, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "specialists" })
    specialist: Specialist;

    @ManyToOne(
        () => ServiceOfferingsMasterList,
        (masterList) => masterList.serviceOfferings
    )
    @JoinColumn({ name: "service_offerings_master_list_id" })
    serviceOfferingsMasterList: ServiceOfferingsMasterList;
}
