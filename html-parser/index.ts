// not spec compliant, halt and catch fire on errors

// we dont support whitespace other than space since typescript will compute superpositional types

import type { hasSuffix, rmSuffix } from "../common/string.ts";
import type { eq, prettify } from "../common/utils.ts";

export type Node = Element | string;

export type Element = {
	tag: string;
	attrs: Record<string, string>;
	children: Node[];
};

// empty el of tag and attrs
type EmptyEl <tag extends string, attrs extends Record<string, string>> = 
	{ tag: tag, attrs: attrs, children: [] }

// parse <tag attrs>
type handleHead <src extends string> = 
	src extends `<${infer tag}>${infer children}` ?
		//has whitespace, has attribute
		tag extends `${infer tag} ${infer attrs}` ? { 
			src: children, voidEl: hasSuffix<attrs, '/'>,
			el: { tag: tag, attrs: prettify<handleAttrs<{}, rmSuffix<attrs, '/'>>>, children: [] } 
		//else it has so attribute
		} :	{ src: children, el: EmptyEl<rmSuffix<tag, '/'>, {}>, voidEl: hasSuffix<tag, '/'> } :
	never
;

// the loop that handle attributes
type handleAttrs <attrs extends Record<string, string>, src extends string> =
	// reached end, return
	src extends '' ? attrs : 
	// remove whitespace
	src extends ` ${infer rest}` ? handleAttrs<attrs, rest> :
	// valueless attribute
	src extends `${infer attr} ${infer rest}` ?
		// it may be a valued attribute, before the next whitespace
		attr extends `${string}=${string}` ?
			handleValuedAttr<attrs, src> :
		// else it is a valueless attribute
		handleAttrs<attrs & Record<attr, ''>, rest> :
	// valued attribute
	src extends `${string}=${string}` ?
		handleValuedAttr<attrs, src> :
		//valueless attribute at the end
		attrs & Record<src, ''>;

type handleValuedAttr <attrs extends Record<string, string>, src extends string> =
	src extends `${infer attr}=${infer rest}` ?
		// 'value'
		rest extends `'${infer value}'${infer rest}` ?
			handleAttrs<attrs & Record<attr, value>, rest> :
		// "value"
		rest extends `"${infer value}"${infer rest}` ?
			handleAttrs<attrs & Record<attr, value>, rest> :
		// value
		rest extends `${infer value} ${infer rest}` ?
			handleAttrs<attrs & Record<attr, value>, rest> :
		// valued value at the end
		attrs & Record<attr, rest> :
	attrs

//handle a child element
type handleChild <inp extends {
	childResult: { el: Element, src: string },
	parent: Element
}> = 
	handleChildrenLoop<{ 
		src: inp['childResult']['src'], 
		el: { tag: inp['parent']['tag'], attrs: inp['parent']['attrs'], children: [...inp['parent']['children'], inp['childResult']['el']] }
	}>;

//handle tag (end or start) in children
type handleTagInChildren <inp extends {
	src: string,
	el: Element
}> = 
	//end tag, return
	inp['src'] extends `/${infer tag}>${infer rest}` ? 
		{ el: inp['el'], src: rest } :
		// child element
		handleChild<{ parent: inp['el'], childResult: handleElement<`<${inp['src']}`> }>

// the loop that handle children
type handleChildrenLoop <inp extends {
	src: string,
	el: Element
}> = 
	// add text till next <
	inp['src'] extends `${infer text}<${infer rest}` ?
		// handle tag
		handleTagInChildren<{ src: rest, 
			el: text extends '' ? 
				inp['el'] : 
				// add text if there
				{ tag: inp['el']['tag'], attrs: inp['el']['attrs'], children: [...inp['el']['children'], text] } 
		}> :
		never;

type handleChildren <inp extends {
	src: string,
	el: Element,
	voidEl: boolean
}> = 
	// quick path if void element
	inp['voidEl'] extends true ? { el: inp['el'], src: inp['src'] } :
	handleChildrenLoop<inp>

type handleElement <src extends string> = 
	handleChildren<handleHead<src>>

export type parse <src extends string> = handleElement<src>['el'];