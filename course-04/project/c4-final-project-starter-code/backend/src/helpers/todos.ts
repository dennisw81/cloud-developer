import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { getUserId } from '../lambda/utils'
import { parseUserId } from "../auth/utils";
// import * as createError from 'http-errors'
import { ItemList, UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'

// TODO: Implement businessLogic
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const todosAccess = new TodosAccess()
export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
  ): Promise<TodoItem> {
    // console.log('Processing event: ', createTodoRequest, jwtToken)
    const itemId = uuid.v4()
    return await todosAccess.createTodo({
        userId: parseUserId(jwtToken),
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    })
  }

  export async function deleteTodo(
    todoId: string, 
    jwtToken: string
  ): Promise<DeleteItemOutput> {
    // console.log('Processing event: ', todoId, jwtToken)
    // const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await todosAccess.deleteTodo(userId, todoId)
  }

  export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,    
    jwtToken: string
  ): Promise<UpdateItemOutput> {
    // console.log('Processing event: ', todoId, updateTodoRequest, jwtToken)
    // const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await todosAccess.updateTodo(userId, todoId, updateTodoRequest)
  }

//   export async function createAttachmentPresignedUrl(
//     createTodoRequest: CreateTodoRequest,
//     jwtToken: string
//   ): Promise<TodoItem> {
  
//     return undefined
//   }

  export async function getTodosForUser(
    userId: string
  ): Promise<ItemList> {
    


    return await todosAccess.getTodosForUser(userId)
  }

  
  