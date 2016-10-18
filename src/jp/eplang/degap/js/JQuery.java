package jp.eplang.degap.js;

import java.io.FileNotFoundException;

import jp.tonyu.util.Resource;
import jp.tonyu.util.SFile;

public class JQuery {
	public static void put(SFile dir) throws FileNotFoundException {
		dir.rel("jquery.js").text(Resource.text(JQuery.class, ".js"));
	}
}
