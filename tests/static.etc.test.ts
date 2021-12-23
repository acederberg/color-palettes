import { tests, create_dummy, create_colors_dummy } from './base.ts'
import { ColorsSafe } from '../src/models'
import static_methods from '../src/models/static'
import mongoose from 'mongoose'

beforeAll( async() => {
        const uri : string = process.env.DB_URI || 'mongodb://localhost:27017/test'
        await mongoose.connect( uri ).catch( err => { throw err })
})
afterAll( async() => {
        var _ids = await tests.find()
        _ids = await _ids.map( item => item._id )
        await tests.deleteMany({ _id : {
                $in : _ids
        } })
        await mongoose.connection.close()
})

describe( 
	"Testing the `read_containing_tags` static methods.",
	function(){
		it( "Creating junk data to do a search by tags.", () => {
			expect.assertions( 1 )
			const with_tags : ColorsSafe = create_dummy({ tags : [ 'this', 'is', 'a', 'test' ] }
			return static_methods.creators.create_new( with_tags )
		})
	}
)
