export {
	with_decide
} from './decorators'

export {
	msg, 
	no_undefined_fields,
	FIELDS,
	NO_FILTER,
	NO_TAGS, 
	NO_UNDEFINED_FIELDS,
	TAGS_REQUIRES_ITEMS,
} from './msg'

export { 
	parse_tags,
	TAGS_CONTAINMENT_VALUE
} from './parsers'

export { 
	create_palletes, 
	read_palletes, 
	update_palletes, 
	delete_palletes, 
	link_palletes,
	read_varients
} from './static'

export {
	Tags, 
	Request, 
	CreateRequest,
	RequestParsed,
	VarientsRequest
} from './types'
