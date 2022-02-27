export { 
	VarientsMethods,
	Varient,
	Varients,
	ObjectId,
	MetadataSafe,
	Metadata, 
	Msg,
	Colors, 
	ColorsDocument, 
	ColorsModel, 
	ColorsSafe 
} from './types'

export { 
	default as queries
} from './queries'

export { colors_schema } from './schemas'

export { 
	find_varients,
	link_as_varients,
	default as static_methods 
} from './static'

export { create_model_for_user } from './models'

export {
	with_exec,
	with_update,
	with_delete,
} from './decorators'

export { default as add_defaults } from './add_defaults'

export { PARAMS } from './validate'

