import * as Core from '@aws-cdk/core';
import { MetaData } from './meta-data';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';

export class DataStack extends Core.Stack {
    constructor(scope: Core.Construct, id: string, props?: Core.StackProps) {
        super(scope, id, props);
        this.createTable("login", "userName");
        this.createTable("order", "userGuid");
    }

    private createTable(tableName:string, partitionKeyName: string, partitionKeyType: AttributeType=AttributeType.STRING):Table
    {
        var name = MetaData.PREFIX+tableName;
        var table = new Table(this, name, {
            tableName: name,
            partitionKey: {
                name: partitionKeyName,
                type: partitionKeyType
            }
        });
        Core.Tags.of(table).add(MetaData.NAME, name);
        return table;
    }    
}