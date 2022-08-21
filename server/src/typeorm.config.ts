import { DataSource } from 'typeorm'
import { Users } from './entities/Users'
import { Posts } from './entities/Posts'
import path from 'path'
import { Upvotes } from './entities/Upvotes'
import 'dotenv-safe/config'

const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	logging: true,
	// synchronize: true, //creates tables automatically, no need to create migrations
	migrations: [path.join(__dirname, './migrations/*')],
	entities: [Posts, Users, Upvotes],
})

export default dataSource
