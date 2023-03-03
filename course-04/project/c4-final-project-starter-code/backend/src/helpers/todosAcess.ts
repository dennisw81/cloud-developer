import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient, ItemList, UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoTable = process.env.TODOS_TABLE) {
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      logger.info("Create todo: " + todo)
      await this.docClient.put({
        TableName: this.todoTable,
        Item: todo
      }).promise()      
      return todo
    }
  
    async getTodosForUser(userId: string): Promise<ItemList> {
      logger.info("Get todos for user: " + userId)
      const result = await this.docClient.query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()
    
      return result.Items
    }

    async updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<UpdateItemOutput> {
      logger.info("Update todo: " + todoId)
      const newItem = await this.docClient
        .update({
          TableName: this.todoTable,
          Key: { 
            todoId, 
            userId },
          ExpressionAttributeNames: {"#N": "name"},
          UpdateExpression: "set #N = :name, dueDate = :dueDate, done = :done",
          ExpressionAttributeValues: {
            ":name": updateTodoRequest.name,
            ":dueDate": updateTodoRequest.dueDate,
            ":done": updateTodoRequest.done
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise()

      logger.info("New item: " + newItem)
      return newItem
    }

    async deleteTodo(userId: string, todoId: string): Promise<DeleteItemOutput> {
      const deleteItem = await this.docClient
        .delete({
          TableName: this.todoTable,
          Key: { 
            todoId, 
            userId },                    
        })
        .promise()

      logger.info("Item deleted: " + deleteItem)
      return deleteItem
    }
  }
  
  function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
  }
  