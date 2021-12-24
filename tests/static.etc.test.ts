import { tests, create_dummy, cleanUp, setUp/*, create_colors_dummy */} from './base'
import { ColorsSafe } from '../src/models'
import static_methods from '../src/models/static'


beforeAll( async () => await setUp() )
afterAll( cleanUp )


describe( 
	"Testing the `read_containing_tags` static methods.",
	function(){
		it( "Creating junk data to do a search by tags.", () => {
			expect.assertions( 1 )
			const with_tags : ColorsSafe = create_dummy({ tags : [ 'this', 'is', 'a', 'test' ] })
			return static_methods.creators.create_new( tests, with_tags ) 
        .then( 
          ( result ) => expect( result ).toMatchObject( with_tags )
		    )
    })
	}
)

