if (typeof require !== 'undefined') XLSX = require('xlsx');

function clamp_range(range) {
	if(range.e.r >= (1<<20)) range.e.r = (1<<20)-1;
	if(range.e.c >= (1<<14)) range.e.c = (1<<14)-1;
	return range;
}

var crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.\(A-Za-z0-9])/g;

/*
deletes `ncols` cols STARTING WITH `start_col`
usage: delete_cols(ws, 4, 3); // deletes columns E-G and shifts everything after G to the left by 3 columns
*/
function deleteCols(ws, start_col, ncols) {
	if(!ws) throw new Error("operation expects a worksheet");
	var dense = Array.isArray(ws);
	if(!ncols) ncols = 0;
	if(!start_col) start_col = 0;

	/* extract original range */
	var range = XLSX.utils.decode_range(ws["!ref"]);
	var R = 0, C = 0;

	var formula_cb = function($0, $1, $2, $3, $4, $5) {
		var _R = XLSX.utils.decode_row($5), _C = XLSX.utils.decode_col($3);
		if(_C >= start_col) {
			_C -= ncols;
			if(_C < start_col) return "#REF!";
		}
		return $1+($2=="$" ? $2+$3 : XLSX.utils.encode_col(_C))+($4=="$" ? $4+$5 : XLSX.utils.encode_row(_R));
	};

	var addr, naddr;
	for(C = start_col + ncols; C <= range.e.c; ++C) {
		for(R = range.s.r; R <= range.e.r; ++R) {
			addr = XLSX.utils.encode_cell({r:R, c:C});
			naddr = XLSX.utils.encode_cell({r:R, c:C - ncols});
			if(!ws[addr]) { delete ws[naddr]; continue; }
			if(ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
			ws[naddr] = ws[addr];
		}
	}
	for(C = range.e.c; C > range.e.c - ncols; --C) {
		for(R = range.s.r; R <= range.e.r; ++R) {
			addr = XLSX.utils.encode_cell({r:R, c:C});
			delete ws[addr];
		}
	}
	for(C = 0; C < start_col; ++C) {
		for(R = range.s.r; R <= range.e.r; ++R) {
			addr = XLSX.utils.encode_cell({r:R, c:C});
			if(ws[addr] && ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
		}
	}

	/* write new range */
	range.e.c -= ncols;
	if(range.e.c < range.s.c) range.e.c = range.s.c;
	ws["!ref"] = XLSX.utils.encode_range(clamp_range(range));

	/* merge cells */
	if(ws["!merges"]) ws["!merges"].forEach(function(merge, idx) {
		var mergerange;
		switch(typeof merge) {
			case 'string': mergerange = XLSX.utils.decode_range(merge); break;
			case 'object': mergerange = merge; break;
			default: throw new Error("Unexpected merge ref " + merge);
		}
		if(mergerange.s.c >= start_col) {
			mergerange.s.c = Math.max(mergerange.s.c - ncols, start_col);
			if(mergerange.e.c < start_col + ncols) { delete ws["!merges"][idx]; return; }
			mergerange.e.c -= ncols;
			if(mergerange.e.c < mergerange.s.c) { delete ws["!merges"][idx]; return; }
		} else if(mergerange.e.c >= start_col) mergerange.e.c = Math.max(mergerange.e.c - ncols, start_col);
		clamp_range(mergerange);
		ws["!merges"][idx] = mergerange;
	});
	if(ws["!merges"]) ws["!merges"] = ws["!merges"].filter(function(x) { return !!x; });

	/* cols */
	if(ws["!cols"]) ws["!cols"].splice(start_col, ncols);
}

module.exports = deleteCols;
