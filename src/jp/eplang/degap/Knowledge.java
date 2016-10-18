package jp.eplang.degap;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.Vector;

import jp.eplang.degap.command.AnyParser;
import jp.tonyu.debug.Log;
import jp.tonyu.soytext2.servlet.Html;
import jp.tonyu.util.A;
import jp.tonyu.util.ArgsOptions;
import jp.tonyu.util.SFile;

import org.eclipse.jetty.xml.XmlParser;
import org.eclipse.jetty.xml.XmlParser.Node;
import org.xml.sax.SAXException;


public class Knowledge {
    SortedMap<String,Path> knownGrammars=new TreeMap<String,Path>();
    Map<Path,PathAnnotation> annotations=new HashMap<Path, PathAnnotation>();
    Map<String,PathComponentAnnotation> compAnnotations=new HashMap<String, PathComponentAnnotation>();

    Vector<ProgramList> lists=new Vector<ProgramList>();
    AnyParser parser;
    private int minmajor;
    boolean programOnly=false;
    Path topPath;
    boolean majorOnly=false;
    private boolean truncSingleList;
    public Knowledge(AnyParser parser, ArgsOptions options) {
        this.truncateLen=options.getInt("trunclen",0);
        this.minmajor=options.getInt("minmajor",0);
        this.programOnly=options.has("po");
        this.majorOnly=options.has("mo");
        this.truncSingleList=options.has("tsl");
        String p=options.getString("toppath",null);
        if (p!=null) {
            this.topPath=new Path();
            for (String pe: p.split("/")) {
                this.topPath.add(pe);
            }
        }
        this.parser=parser;
    }
    /*public Knowledge(AnyParser parser) {
        this(parser, 0);
    }*/
    public void addProgram(ProgramList f) throws IOException {
        PathChecker pc=new PathChecker(truncSingleList);
        //String src = f.text();
        //System.out.println(src);
        XmlParser p=new XmlParser();
        try {
            Node res2=p.parse(f.srcFile.inputStream());
            pc.traverse(new Path(), res2);
            pc.paths.removeAll(knownGrammars.values());
            int seq=1;
            String ss=f.name;
            for (Path pa:pc.paths) {
                if (pa.endWithAttr()) continue;
                if (pa.size()<=truncateLen) continue;
                if (topPath!=null && ( !topPath.isSubpathOf(pa) || topPath.equals(pa) ) ) continue;
                add(pa,f);
                PathAnnotation a=getAnnotation(pa);
                a.symbol=ss+"-"+seq;
                seq++;
            }
            PathTruncator trunc=new PathTruncator(this/*, pc.paths*/);
            for (Path s:pc.paths) {
                if (s.endWithAttr()) continue;
                scanComponents(s,f);
                //Path[] kn=trunc.convertToKnown(s);
                Path[] sn=trunc.truncateSubset(s);
                PathAnnotation a=getAnnotation(s);
                /*if (kn!=null && sn!=null) {
                    a.canbeLearnedFrom=A.rray(kn,sn);
                    a.minorType="both";
                } else */if (sn!=null) {
                    a.canbeLearnedFrom=new Path[][]{sn};
                    a.minorType="a/b -> b/c";
                }/* else if (kn!=null) {
                    a.canbeLearnedFrom=new Path[][]{kn};
                    a.minorType="a/b ,  a/c";
                }*/
            }
            lists.add(f);
        } catch (SAXException e) {
            Log.d(this, "Error at "+f.srcFile);
            e.printStackTrace();
        }
    }
    private void scanComponents(Path s, ProgramList list) {
        for (String pathComponent:s.path) {
            PathComponentAnnotation a=compAnnotations.get(pathComponent);
            if (a!=null) continue;
            a=new PathComponentAnnotation(pathComponent, list);
            list.learnComponents.add(pathComponent);
            compAnnotations.put(pathComponent, a);
        }

    }
    public void header(PrintStream out) {
    	out.println("<html><head>" +
                "<script src=\"jquery.js\"></script>"+
//    	        "<script src=\"http://code.jquery.com/jquery-latest.min.js\"></script>"+
    			"<script src=\"Highlight.js\"></script>"+
    	        "<style>.pathsrc { display: none; }  </style>"+
    	        		"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf8\"></head><body>"+
    	        "<button class=togmbtn>toggle minor</button>");
    }
    public void reportAll(PrintStream out, PrintStream csv) throws IOException {
        for (ProgramList l:lists) {
        	System.out.println("Reporting "+l);
            report(out, csv, l);
        }
    }
    public PathAnnotation getAnnotation(Path p) {
        PathAnnotation res=annotations.get(p);
        if (res!=null) return res;
        res=new PathAnnotation();
        annotations.put(p,res);
        return res;
    }
    int truncateLen;
    public void report(PrintStream out, PrintStream csv, ProgramList l) throws IOException {
        int total=l.learns.size(),major=total,minor=0, tailPath=0;
        for (Path pa:l.learns) {
            PathAnnotation a=getAnnotation(pa);
            Path[][] cl=a.canbeLearnedFrom;
            if (cl!=null) {major--; minor++;}

        }
        for (int i=0 ; i < l.learns.size()-1 ; i++) {
        	Path pre=l.learns.get(i);      //  a/b
        	Path post=l.learns.get(i+1);   //  a/b/c
        	PathAnnotation apre=getAnnotation(pre);
        	PathAnnotation apost=getAnnotation(post);
        	if (apost.canbeLearnedFrom!=null) continue;
        	if ( pre.isSubpathOf(post) ) {  //  a/b is subpath of a/b/c
        		apre.hasSuperPath=true;     //  a/b has superpath
        	}
        }
        //   a/b/c is superpath of a/b
        //  なんか逆のような気がするけど．．．  {a,b,c} is superset of {a,b} からの類推のようだ
        for (Path pa:l.learns) {
            PathAnnotation a=getAnnotation(pa);
        	if (a.canbeLearnedFrom==null && !a.hasSuperPath) tailPath++;
        }
        if (major<minmajor) return;

        if (parser.xmlPositinSensitive) {
            out.println(
                    Html.p("<span class=programlist><a name=%a></a><h2>%t</h2>" +
                    		"<!-- %s --><pre>%s</pre>",
                            l.name, l.name, l.srcFile.toString(), l.xmlSource() ));
        } else {
            out.println(
                    Html.p("<span class=programlist><a name=%a></a><h2>%t</h2><pre>%t</pre>",
                            l.name, l.name,l.programSource() ));
        }
        if (programOnly) return ;
        out.println(Html.p("<h3>%s new elements: (%s major(%s tailPath), %s minor)</h3>",
                ""+total, ""+major, ""+tailPath,  ""+minor));
        csv.printf("%s,%s,%s,%s\n", l.toString(), major,tailPath, minor);
        if (l.learns.size()>0) {
            out.println("<h3> New concepts appear in "+l+"</h3>");
            out.println("<span class=clist><button class=togmbtn>toggle minor</button>");
        }
        int tc=(topPath!=null ? topPath.size() : 0);
        for (Path pa:l.learns) {
            if (pa.endWithAttr()) continue;
            PathAnnotation a=getAnnotation(pa);
            Path[][] cl=a.canbeLearnedFrom;
            if (majorOnly && cl!=null) continue;
            String col=(cl!=null?"#aaaaaa":"black");
            StringBuffer crumbs=new StringBuffer();
            StringBuffer crumbsp=new StringBuffer();
            String sep="",sepp="";
            int cnt=0;
            for (String pae:pa.path) {
                cnt++; if (cnt<=truncateLen || cnt<=tc ) continue;
                ProgramList le=learnedAt(pae);
                crumbs.append(sep);
                crumbsp.append(sepp);
                sep="/";
                sepp=" > ";
                //sep="▶";
                String t=Translate.translate(pae);
                if (le.equals(l)) {
                    crumbs.append(Html.p("<font color=red>%t</font>",t));
                } else {
                    crumbs.append(t);
                    //crumbs.append(Html.p("<a href=%a>%t</a>", "#"+le.name , pae));
                }
                crumbsp.append(pae);
            }
            String subPathMark=(getAnnotation(pa).hasSuperPath ?  ""/*"+"*/ :"");
            String minorMark =(cl!=null ? "*":"");
            out.println(Html.p("<div class=%a>",   cl!=null?"minor":"major"));// A
            out.println(Html.p(
            		"<div><!--a href=%s>Src</a--> %s%s%t: <span class=path>" +
            		"<font color=%a><a name=%a ></a>%s</font>" +
            		"<span class=\"pathsrc\">%t</span>" +
            		"</span></div>",
                    "#"+l.name,  minorMark , subPathMark, a.symbol ,
                    col,  a.symbol, crumbs+"",
                    crumbsp+""));
            if (cl!=null) {
                out.print("<div>"+
                        a.symbol+" is a Minor new concept; can be learned from: " +
                        "</div>");
                out.print("<div>");
                sep="";
                for (Path[] pe:cl) {
                    out.print(sep);
                    String sep2="";
                    for (Path pee:pe) {
                        PathAnnotation aa=getAnnotation(pee);
                        out.print(
                                Html.p(sep2+"<a href=%a>%t</a>%s", "#"+aa.symbol, aa.symbol, pee.clone().subpath(tc).toString() )
                        );
                        sep2="+";
                    }
                    sep=" or ";
                }
                out.print("</div>");
            }
            out.println("</div>"); // end of A
        }
        if (l.learns.size()>0) {
            out.println("</span>");
        }
        out.println("</span>");
    }
    private ProgramList learnedAt(String pathComponent) {
        PathComponentAnnotation a=compAnnotations.get(pathComponent);
        if (a==null) return null;
        return a.learnedAt;
    }
    private void add(Path pa, ProgramList f) {
        f.learns.add(pa);
        knownGrammars.put(pa.toString(), pa);
        getAnnotation(pa).learnedAt=f;
    }
    public boolean contains(Path pp) {
        return knownGrammars.containsKey(pp.toString());
    }
    public Collection<Path> paths() {
        return knownGrammars.values();
    }
    public ProgramList learnedAt(Path pp) {
        return getAnnotation(pp).learnedAt;// learnedAt.get(pp);
    }
}
