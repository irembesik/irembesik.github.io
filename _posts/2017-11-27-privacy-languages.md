---
layout: post
title:  "Privacy Languages"
date:   2017-11-27 17:00:00
categories: 
  - privacy
  - phd-posts
---

I would like to start the article by giving some introductory information about two prominent privacy-related terminologies 
which are **privacy policy** and **privacy preference**.

## Privacy Policy:

A privacy policy is a statement or a legal document that discloses some or all of the ways a party gathers, uses, discloses, 
and manages a customer or client's data. In the case of a business it is often a statement that declares a party's policy 
on how it collects, stores, and releases personal information it collects. It informs the client what specific information 
is collected, and whether it is kept confidential, shared with partners, or sold to other firms or enterprises.[1]

## Privacy Preference:

A privacy preference expresses a user’s individual wishes with regards to their privacy, i.e. the disclosure
of their personal data and their processing after disclosure.[2] Privacy Preferences can be considered as user-centric form 
of privacy policies.

![alt text](https://www.w3.org/2003/p3p-ws/pp/figPolicyTypes.gif)

Now, let's discuss some privacy policy languages (P3P and EPAL) and some privacy preference languages (APPEL and XPref). 

---

## Platform for Privacy Preferences (P3P) Project
The P3P Project, developed by W3C, enables Web sites to express their privacy practices in a standard format 
that can be retrieved automatically and interpreted easily by user agents. P3P user agents will allow 
users to be informed of site practices (in both machine- and human-readable formats) and to automate decision-making based 
on these practices when appropriate. P3P adds transparency about privacy implications to the Web's Architecture.[3]

The below image summarizes how P3P works: [4]

![alt text](http://archive.oreilly.com/network/excerpt/p3p/graphics/wsc2_ac01.gif)

#### P3P / XML Encoding:

![alt text](https://image.slidesharecdn.com/priv4ppt114/95/priv4ppt-45-728.jpg?cb=1273624516)

#### P3P Vocabulary: [5]
- *Who* is collecting data? 
- *What data* is collected?
- For *what purpose* will data be used?
- Is there an ability to *change preferences* about (opt-in or opt-out) of some data uses?
- Who are the *data recipients* (anyone beyond the data collector)?
- To what information does the data collector provide *access*?
- What is the *data retention* policy?
- How will *disputes* about the policy be resolved?
- Where is the *human-readable privacy policy*?

P3P policy shown below means the following: 

*The postal information will be used for the admin purpose; the information will be shared with the public 
and will be stored indefinitely.*[6]

```xml
<STATEMENT>
 <PURPOSE><admin required="opt-in"/></PURPOSE>
 <RECIPIENT><public/></RECIPIENT>
 <RETENTION><indefinitely/></RETENTION>
 <DATA-GROUP>
  <DATA ref="#user.home-info.postal"><DATA/>
 </DATA-GROUP>
</STATEMENT> 
```
---

## A P3P Preference Exchange Language (APPEL)
APPEL (A P3P Preferences Exchange Language) is a W3C work that specifies a language for describing sets of preferences 
about P3P policies. Using this language, a user can express her preferences in a set of preference-rules (called a ruleset), 
which can then be used by her user-agent to make automated or semi-automated decisions regarding the exchange of data with 
P3P-enabled web sites. [7]

![alt text](https://image.slidesharecdn.com/slides1872/95/slides-11-728.jpg?cb=1273624517)

APPEL rule set shown below implements the following preference:

*Block sites whose policies indicate that the information collected can be used for contact or telemarketing.*

```xml
<appel:RULESET> 
  <appel:RULE behavior="block"> 
    <POLICY>
      <STATEMENT> 
        <PURPOSE appel:connective="or"> 
          <contact/>
          <telemarketing/> 
        </PURPOSE> 
      </STATEMENT> 
    </POLICY>
  </appel:RULE>
  
  <appel:RULE behavior="request"/> 
    <appel:OTHERWISE/> 
  </appel:RULE> 
</appel:RULESET>
```
---

## Enterprise Privacy Authorization Language (EPAL)

IBM introduced EPAL to fill the deficiencies of P3P. EPAL is a formal language that provides enterprises with a way to automate and enforce privacy policies across IT applications and systems.

Like P3P, EPAL is an XML-based privacy policy specification language, but it is designed for organizations to specify internal privacy policies. These EPAL policies can be used internally and amongst the organization and its business partners to ensure compliance with the underlying policies of each. [8]

EPAL policy shown below means the following:

*Email can be used for the book-of-month club only if consent has been given and age is more than 13.*

```xml
<rule id="rule1" ruling="allow">
<data-user id="borderless-books"/>
<data-category id="email"/>
<purpose id="book-of-the-month-club"/>
<action id="read"/>
<condition id="consentToBookClub"/>
<condition id="olderThan13"/>
<obligation id="retention">
          <parameter id="days">5</parameter>
</obligation>
```
*Parents are allowed to read any data of their children is formalized as:*

```xml
</rule>
<rule id="rule2" ruling="allow">
<data-user id = "parent"/>
           <data-category id = "p3p: any category"/>
           <purpose id = "p3p: current"/>
           <action id = "read"/>
</rule>
```

### EPAL vs. P3P

P3P is an excellent language for expressing high level privacy promises on web sites. However, EPAL should be used to define an enforceable privacy policy within an enterprise. [9]

![Alt text](https://raw.github.com/irembesik/irembesik.github.io/master/_posts/epal-p3p.png)


---

## XPref

The preference language APPEL has some problems: Users can only directly specify what is unacceptable in a policy, not what is acceptable; simple preferences are hard to express; and writing APPEL preferences is error prone. These limitations of APPEL motivated Agrawal et. al. to propose another language for expressing privacy preferences, namely XPref. XPref is based on XPath. In essence, XPref replaces the body of APPEL rules with XPath expressions. [10]

---

XPath (XML Path Language) is the W3C standard language which is based on a tree representation of the XML document, and provides the ability to navigate around the tree. [11]

---

A preference, *block if the P3P policy includes contact or telemarketing purposes*, can be written in XPref as follows:

```xml
<RULESET> 
 <RULE behavior="block"
  condition="/POLICY/STATEMENT/PURPOSE/* 
   [name(.) = "contact" or 
   name(.) = "telemarketing"]" />
 
 <RULE behavior="request" condition="true"/> 
</RULESET>
```

A preference, *not to block websites that require opt-in for contact and telemarketing*, can be written in XPref as follows:

```xml
<RULESET> 
 <RULE behavior="block"
  condition="/POLICY/STATEMENT/PURPOSE/* 
   [name(.) = "contact" or 
   name(.) = "telemarketing"]" and 
   @required != "opt-in"]"/>
 
 <RULE behavior="request" condition="true"/> 
</RULESET>
```

The following preference ensures that *all purposes across all statements are strictly current or pseudo-analysis*.

```xml
<RULESET> 
 <RULE behavior="request"
  condition="/POLICY [
   every $pname in 
   STATEMENT/PURPOSE/* satisfies 
    (name($pname) = "current" or
    name($pname) = "pseudo-analysis")
   ]" />
   
 <RULE behavior="block" condition="true"/> 
</RULESET>
```

XPref rule set shown below implements the following preference:

*The purposes current and pseudo-analysis are acceptable. The purpose individual-analysis is also acceptable, as long as the recipient is ours.*

```xml
<RULESET> 
 <RULE behavior="request"
  condition="/POLICY [
   every $stmt in STATEMENT satisfies (  
    every $purpose in $stmt/PURPOSE/*, 
    every $recip in $stmt/RECIPIENT/* satisfies  
     (name($purpose) = "current" or
     name($purpose) = "pseudo-analysis" or
     (name($purpose) = "individual-analysis" and name($recip) = "ours")) )]" />
     
 <RULE behavior="block" condition="true"/> 
</RULESET>
```
---

#### References:

[1] “Privacy Policy.” Wikipedia, Wikimedia Foundation, 6 Nov. 2017, [en.wikipedia.org/wiki/Privacy_policy](https://en.wikipedia.org/wiki/Privacy_policy).

[2] “What Is Privacy Preference.” IGI Global, [www.igi-global.com/dictionary/privacy-preference/50059](https://www.igi-global.com/dictionary/privacy-preference/50059).

[3] World Wide Web Consortium. ["Platform for privacy preferences (P3P) project."](https://www.w3.org/P3P/) World Wide Web Consortium. Retrieved July 5 (2007): 2007.

[4] Cranor, Lorrie. Web privacy with P3P. " O'Reilly Media, Inc.", 2002.

[5] Langheinrich, Marc. "[Internet Privacy and P3P.](https://www.vs.inf.ethz.ch/publ/slides/p3p-www10-0508-export.pdf)" (2001).

[6] Yu, Ting, Ninghui Li, and Annie I. Antón. "A formal semantics for P3P." Proceedings of the 2004 workshop on Secure web service. ACM, 2004.

[7] Cranor, Lorrie, Marc Langheinrich, and Massimo Marchiori. ["A P3P preference exchange language 1.0 (APPEL1. 0)."](https://www.w3.org/TR/2002/WD-P3P-preferences-20020415/#appel) W3C working draft 15 (2002).

[8] Stufflebeam, William H., et al. "Specifying privacy policies with P3P and EPAL: lessons learned." Proceedings of the 2004 ACM workshop on Privacy in the electronic society. ACM, 2004.

[9] ASHLEY, P., et al. ["The Enterprise Privacy Authorization Language (EPAL)– How to Enforce Privacy throughout an Enterprise"](https://www.w3.org/2003/p3p-ws/pp/ibm3.html). W3C, 2003.

[10] Agrawal, Rakesh, et al. "XPref: a preference language for P3P." Computer Networks 48.5 (2005): 809-827.

[11] Geneves, Pierre. ["Course: The XPath Language."](http://wam.inrialpes.fr/courses/PG-MoSIG12/xpath.pdf) (2012).
