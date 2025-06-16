// import * as dotenv from 'dotenv'
// import express from 'express'
// import { PrismaClient } from '@prisma/client'
// import { assert } from 'superstruct'
// import { CreateUser } from './structs.js'

// dotenv.config()

// const prisma = new PrismaClient()

// const app = express()
// app.use(express.json())

// app.get('/users', async (req, res) => {
//   const { offset = 0, limmit = 10, order = 'newest' } = req.query
//   const users = await prisma.user.findMany({
//     // select: {
//     //   id: true,
//     //   email: true,
//     //   firstName: true
//     // },
//     skip: parseInt(offset),
//     take: parseInt(limmit),
//     orderBy: {
//       createdAt: order === 'newest' ? 'desc' : 'asc' //asc: 오름차순(작>큰) dsc: 내림차순(큰>작)
//     }
//   })
//   res.send(users)
// })

// app.get('/users/:id', async (req, res) => {
//   const { id } = req.params
//   const user = await prisma.user.findUnique({
//     where: { id },
//   })
//   res.send(user)
// })

// app.post('/users', async (req, res) => {
//   assert(req.body, CreateUser)
//   // 리퀘스트 바디 내용으로 유저 생성
//   const user = await prisma.user.create({
//     data: req.body
//   })
//   res.status(201).send(user)
// })

// app.patch('/users/:id', async (req, res) => { //patch는 delete와 상세조회(get)의 복합체라 data:req.body, where:{ id }를 받아옴
//   assert (req.body, CreateUser)
//   const { id } = req.params
//   // 리퀘스트 바디 내용으로 id에 해당하는 유저 수정
//   prisma.user.update({
//     data: req.body,
//     where: {
//       id
//     }
//   })
//   res.send(user)
// })

// app.delete('/users/:id', async (req, res) => {
//   const { id } = req.params
//   // id에 해당하는 유저 삭제
//   prisma.delete({
//     where: {
//       id: id
//     }
//   })
//   res.sendStatus(204)
// })

// app.listen(process.env.PORT || 3000, () => console.log('Server Started'))

import { 
	// ...
	PostSavedProduct,
} from './structs.js'

// ...

// '/users/:id/saved-products' GET 메소드 기반
app.post('/orders', asyncHandler(async (req, res) => {
  assert(req.body, CreateOrder);
  const { userId, orderItems } = req.body
  
  // 상품 목록 조회
  const productIds = orderItems.map((orderItem) => orderItem.productId)
  const products = await prisma.product.findMany({
	  where: {
		  id: { in: productIds }
	  },
  })
  
  // 주문 상품 별 재고 조회
  const getQuantity = (productId) => {
	  const orderItem = orderItems.find((orderItem) => orderItem.productId === productId)
	  return orderItem.quantity
  }
  
  // 재고 수량 확인
  const isSufficientStock = products.every((product) => {
	  const { id, stock } = product
	  return stock >= getQuantity(id)
  })
  
  if (!isSufficientStock) {
	  throw new Error('Insufficient Stock')
  }
  
  const order = await prisma.order.create({
    data: {
	    userId,
	    orderItems: {
		    create: orderItems
	    }
    },
    include: {
	    orderItems: true
    }
  });
  res.status(201).send(order);
}));