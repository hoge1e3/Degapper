package jp.eplang.degap.command;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.jetty.xml.XmlParser;
import org.eclipse.jetty.xml.XmlParser.Node;
import org.mozilla.javascript.Function;
import org.xml.sax.SAXException;


import jp.eplang.degap.Knowledge;
import jp.eplang.degap.ProgramList;
import jp.eplang.degap.js.Highlight;
import jp.eplang.degap.js.JQuery;
import jp.tonyu.js.JSFileRunner;
import jp.tonyu.util.ArgsOptions;
import jp.tonyu.util.SFile;


public class Check {
    static final Pattern numHead=Pattern.compile("([0-9]+)(.*)");
    private static final Comparator<SFile> WITHOUTEXT=new Comparator<SFile>() {
        @Override
        public int compare(SFile o1, SFile o2) {
            String n1=o1.name().replaceAll("\\.\\w+\\.xml$", "");
            String n2=o2.name().replaceAll("\\.\\w+\\.xml$", "");
            Matcher nm1=numHead.matcher(n1);
            Matcher nm2=numHead.matcher(n2);
            if (nm1.matches() && nm2.matches()) {
                int nn1= Integer.parseInt( nm1.group(1) );
                int nn2= Integer.parseInt( nm2.group(1) );
                if (nn1!=nn2) return nn1-nn2;
                return nm1.group(2).compareTo(nm2.group(2));
            }
            return n1.compareTo(n2);
        }
    };
    static Set<String> exclude=new HashSet<String>();
    static Knowledge k;
    public static void traverse(SFile file) throws IOException {
        if (exclude.contains(file.name())) return;
        if (file.isDir()) {
            for (SFile f:file.order(WITHOUTEXT)) {
                traverse(f);
            }
        } else if (file.name().endsWith(".xml")) {
            //System.out.println("Traverse "+file);
            if (file.fullPath().indexOf("exclude")>=0) return;
            ProgramList p=new ProgramList(file);
            k.addProgram(p);
        }
    }
    /*
      -trunclen=int -minmajor=int -po -mo -tsl -exclude=name1:name2:...
    this.truncateLen=options.getInt("trunclen",0);
    this.minmajor=options.getInt("minmajor",0);
    this.programOnly=options.has("po");
    this.majorOnly=options.has("mo");
    this.truncSingleList=options.has("tsl");
    */
    public static void main(String[] args) throws IOException {
        /*SFile tf=new SFile("C:/bin/Dropbox/cej1203nishidaLangedu/java_text/matsuzawa");
        for (SFile f:tf.order(WITHOUTEXT)) {
            System.out.println(f);
        }
        System.out.println( WITHOUTEXT.compare(new SFile("10"), new SFile("107")) );
        System.exit(1);*/
        main(new ArgsOptions(args));
    }
    public static void main(ArgsOptions ar) throws IOException {
        //System.out.println(ar.getInt("minmajor", 60));
        SFile dir = new SFile(ar.args[0]);
        k=new Knowledge(new AnyParser(ar.args[1]),ar);

        if (ar.has("exclude")) {
            String e=ar.getString("exclude", "");
            for (String ee:e.split(":")) {
                exclude.add(ee);
            }
        }
        traverse(dir);
        SFile outf=dir.rel("report.html");
        Highlight.put(dir);
        JQuery.put(dir);
        SFile csvf=dir.rel("report.csv");

        //PrintStream out=new PrintStream(outf.outputStream());
        PrintStream out=new PrintStream(outf.outputStream(), false ,"utf-8");
        PrintStream csv=new PrintStream(csvf.outputStream(), false ,"utf-8");
        csv.println("name,major,tail,minor");
        k.header(out);
        k.reportAll(out, csv);
        out.close();
        csv.close();
    }
}
