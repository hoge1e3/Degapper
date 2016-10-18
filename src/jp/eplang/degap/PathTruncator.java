package jp.eplang.degap;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jp.tonyu.util.A;


public class PathTruncator {
    Knowledge known;//=new TreeSet<Path>();
    //SortedSet<Path> newlyLearned=new TreeSet<Path>();
/*
When newly learned:
  >a>b>c         stmts> expr
  >a>b>c>d       stmts> if > expr
    regards a>b>c>d as known when a>b>d is known
      a>b>c>d can be learned from a>b>c> and a>b>d
 */
    public Path[] convertToKnown(Path p) {
        // p = a>b>c>d
        Path pp=p.clone();
        Path anchorPath=p.clone();
        int rmc=0;
        for (; !pp.isEmpty() && !known.contains(pp) ; pp.removeLast()) {rmc++;}
        // pp= a>b  rmc=2
        for (; rmc>1 ; rmc--) {anchorPath.removeLast();}
        while (anchorPath.endWithAttr()) anchorPath.removeLast();
        // anchorPath =  a>b>c
        // pp = a>b
        int pos=pp.size(); // 2
        pp=p.clone(); // a>b>c>d
        for (; pp.size()>pos && !known.contains(pp) ; pp.removeAt(pos));
        // pp = a>b>d
        if (pp.size()>pos) {
            return A.rray(anchorPath, pp);
        }
        return null;
    }
    public PathTruncator(Knowledge known/*, SortedSet<Path> newlyLerned*/) {
        super();
        this.known=known;
        //this.newlyLearned=newlyLerned;
    }
    /*
     * >function_definition>_body>compound_statement>statements>if>_else>if
>function_definition>_body>compound_statement>statements>if>_else>if>_condition
>function_definition>_body>compound_statement>statements>if>_else>if>_condition>comp
>function_definition>_body>compound_statement>statements>if>_else>if>_condition>comp>number -> comp>number is known path
>function_definition>_body>compound_statement>statements>if>_else>if>_condition>comp>op
>function_definition>_body>compound_statement>statements>if>_else>if>_condition>comp>variable
>function_definition>_body>compound_statement>statements>if>_else>if>_condition>comp>variable>_name

     */
    public Path[] truncateSubset(Path p){
        // nl0 = a>b>c     // anchor path
        // nl1 = a>b>c>d
        // p   = a>b>c>d
        // if there is known path ended with c>d, a>b>c>d can be learned.
        if (p.isEmpty()) return null;
        Path pp=p.clone().removeLast(); // a>b>c
        //for (;!pp.isEmpty() && ( !newlyLerned.contains(pp) || pp.endWithAttr()  ); pp.removeLast());
        //for (;!pp.isEmpty() && ( ( !known.contains(pp) &&  !newlyLearned.contains(pp)) || pp.endWithAttr()  ); pp.removeLast());
        for (;!pp.isEmpty() && ( !known.contains(pp) || pp.endWithAttr()  ); pp.removeLast());
        // anchorPath= a>b>c
        Path anchorPath=pp;
        if (anchorPath.isEmpty()) return null;
        int c = anchorPath.size()-1;  // c=2
        Path sp=p.clone().subpath(c); // sp= c>d
        Vector<Path> resCands=new Vector<Path>();;
        for (Path k: known.paths()) {
            if (!k.equals(p) && k.toString().endsWith(sp.toString())) {
                resCands.add(k);
                //return A.rray(anchorPath, k);// "Can be leraned from "+anchorPath+" and "+k+" learned at "+known.learnedAt(k).name();
            }
        }
        /*for (Path k: newlyLearned) {
            if (!k.equals(p) && k.toString().endsWith(sp.toString())) {
                resCands.add(k);
                //return A.rray(anchorPath, k);// "Can be leraned from "+anchorPath+" and "+k+" learned at "+known.learnedAt(k).name();
            }
        }*/
        String minSym=null;
        Path res=null;
        String thisPath=known.getAnnotation(p).symbol;
        for (Path resCand:resCands) {
            PathAnnotation rcAnon = known.getAnnotation(resCand);
            if ( compSym ( rcAnon.symbol, thisPath)>0) {
                continue;
            }
            if (res==null || compSym ( rcAnon.symbol, minSym)<0) {
                res=resCand;
                minSym=rcAnon.symbol;
            }
        }
        if (res!=null) {
            return A.rray(anchorPath, res);
        }
        return null;
    }
    static Pattern sp=Pattern.compile("(.*)-([0-9]+)");
    public static int compSym(String a, String b) {
        Matcher ma=sp.matcher(a);
        Matcher mb=sp.matcher(b);
        if (ma.matches() && mb.matches()) {
            int r=ma.group(1).compareTo(mb.group(1));
            if (r!=0) return r;
            return Integer.parseInt(ma.group(2))-Integer.parseInt(mb.group(2));
        }
        return a.compareTo(b);
    }
    public static void main(String[] args) {
        System.out.println(compSym("aab-4","aaa-10"));
    }
}
