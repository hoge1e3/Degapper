package jp.eplang.degap;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.jetty.util.ajax.JSON;

import jp.tonyu.util.Resource;

public class Translate {
    static Map<String,String> m=new HashMap<String, String>();
    static {
        String s=Resource.text(Translate.class, ".json");
        System.out.println(s);
        m=(Map)JSON.parse(s);
    }
    public static String translate(String s) {
        String r=m.get(s);
        if (r==null) return s;
        return r;
    }
}
