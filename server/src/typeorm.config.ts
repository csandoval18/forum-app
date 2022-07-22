import { DataSource } from 'typeorm'
import { Users } from './entities/Users'
import { Posts } from './entities/Posts'
import path from 'path'

const dataSource = new DataSource({
	type: 'postgres',
	database: 'forum',
	username: 'Christian',
	password: 'root',
	logging: true,
	synchronize: true, //creates tables automatically, no need to create migrations
	migrations: [path.join(__dirname, './migrations/*')],
	entities: [Posts, Users],
})

export default dataSource
