import { ColorsModel, ColorsSafe } from '../src/models/types'
import { create_model_for_user } from  '../src/models'
import static_methods from '../src/models/static'

const tests : ColorsModel = create_model_for_user( "tester" ) ;

describe(
	"Testing model creation.", 
	function(){

		it( "Bad data. ( Description too long )",  () => {

			const colors : ColorsSafe = {
				colors : {},
				metadata : {
					description : '',
					name : '',
					tags : [],
					varients : []
				}
			}
			static_methods.creators.create_new( tests, colors )
		
		})

	}
)
describe(
	"Testing the schema.",
	function(){

	}
)

