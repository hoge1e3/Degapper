package jp.eplang.degap.js;

import java.io.FileNotFoundException;

import jp.tonyu.util.Resource;
import jp.tonyu.util.SFile;

public class Highlight {
	public static void put(SFile dir) throws FileNotFoundException {
		dir.rel("Highlight.js").text(Resource.text(Highlight.class, ".js"));
	}
}
