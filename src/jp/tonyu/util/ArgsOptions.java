package jp.tonyu.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Vector;

public class ArgsOptions {
    public String[] args;
    public String inputHead="?";
    public Map<String, String> options=new HashMap<String, String>();
    public String ask(String value, String name) {
        if (value.startsWith(inputHead)) {
            if (name==null) {
                name=value.substring(inputHead.length());
            }
            System.out.print(name+"? ");
            Scanner s=new Scanner(System.in);
            String r=s.nextLine();
            return r;
        }
        return value;
    }
    public ArgsOptions(String... rawArgs) {
        List<String> argv=new Vector<String>();
        for (int i=0 ;i<rawArgs.length; i++) {
            String rarg=rawArgs[i];
            if (rarg.startsWith("-")) {
                String keyvalue = rarg.substring(1);
                String[] keyvaluea= keyvalue.split("=");
                System.out.println("Setopt "+keyvaluea[0]);
                options.put(keyvaluea[0], (keyvaluea.length>=2 ? ask(keyvaluea[1],keyvaluea[0]) : "true" ));
            } else {
                argv.add(ask(rarg,null));
            }
        }
        args=argv.toArray(new String[0]);
    }
    public int getInt(String key, int defVal) {
        try {
            return Integer.parseInt(options.get(key));
        } catch (NumberFormatException e) {
            //e.printStackTrace();
            return defVal;
        }
    }
    public static void main(String[] args) {
        ArgsOptions ar = new ArgsOptions("a","-test=5");
        System.out.println(ar.getInt("test", 123));
    }
    public boolean has(String key) {
        return options.containsKey(key);
    }
    public String getString(String key, String def) {
        if (options.containsKey(key)) return options.get(key);
        return def;
    }
    public String getString(int i, String def) {
        try {
            return args[i];
        } catch(Exception e) {
            return def;
        }
    }
    public int getInt(int i, int def) {
        try {
            return Integer.parseInt(args[i]);
        } catch(Exception e) {
            return def;
        }
    }
}
