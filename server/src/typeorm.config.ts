import { DataSource } from 'typeorm'
import { Users } from './entities/Users'
import { Posts } from './entities/Posts'

const dataSource = new DataSource({
	type: 'postgres',
	database: 'forum',
	username: 'Christian',
	password: 'root',
	logging: true,
	synchronize: true, //creates tables automatically, no need to create migrations
	entities: [Posts, Users],
})

export default dataSource
