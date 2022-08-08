import { withUrqlClient } from 'next-urql'
import React from 'react'
import { createUrqlClient } from '../../../utils/createUrqlClient'

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = () => {
	return <div>Hello</div>
}

export default withUrqlClient(createUrqlClient)(EditPost)
