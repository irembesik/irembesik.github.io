---
layout: post
title:  "Platform for Privacy Preferences (P3P) Project"
date:   2017-11-27 17:00:00
categories: privacy preference
---

I would like to start the article by giving some introductory information about two prominent privacy-related terminologies 
which are privacy policy and privacy preference.

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

## Platform for Privacy Preferences (P3P) Project
The P3P Project, developed by W3C, enables Web sites to express their privacy practices in a standard format 
that can be retrieved automatically and interpreted easily by user agents. P3P user agents will allow 
users to be informed of site practices (in both machine- and human-readable formats) and to automate decision-making based 
on these practices when appropriate. P3P adds transparency about privacy implications to the Web's Architecture.[3]

The below image summarizes how P3P works: [4]

![alt text](http://archive.oreilly.com/network/excerpt/p3p/graphics/wsc2_ac01.gif)

P3P / XML Encoding:

![alt text](https://image.slidesharecdn.com/priv4ppt114/95/priv4ppt-45-728.jpg?cb=1273624516)

P3P Vocabulary: [5]
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

## A P3P Preference Exchange Language (APPEL)
APPEL (A P3P Preferences Exchange Language) is a W3C work that specifies a language for describing sets of preferences 
about P3P policies. Using this language, a user can express her preferences in a set of preference-rules (called a ruleset), 
which can then be used by her user-agent to make automated or semi-automated decisions regarding the exchange of data with 
P3P-enabled web sites.

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

## EPAL

## XPref

References:

[1] “Privacy Policy.” Wikipedia, Wikimedia Foundation, 6 Nov. 2017, [en.wikipedia.org/wiki/Privacy_policy](https://en.wikipedia.org/wiki/Privacy_policy).

[2] “What Is Privacy Preference.” IGI Global, [www.igi-global.com/dictionary/privacy-preference/50059](https://www.igi-global.com/dictionary/privacy-preference/50059).

[3] World Wide Web Consortium. ["Platform for privacy preferences (P3P) project."](https://www.w3.org/P3P/) World Wide Web Consortium. Retrieved July 5 (2007): 2007.

[4] Cranor, Lorrie. Web privacy with P3P. " O'Reilly Media, Inc.", 2002.

[5] Langheinrich, Marc. "[Internet Privacy and P3P.](https://www.vs.inf.ethz.ch/publ/slides/p3p-www10-0508-export.pdf)" (2001).

[6] Yu, Ting, Ninghui Li, and Annie I. Antón. "A formal semantics for P3P." Proceedings of the 2004 workshop on Secure web service. ACM, 2004.
APA	
