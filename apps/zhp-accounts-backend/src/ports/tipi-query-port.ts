import type { ZhpMember, ZhpUnit } from "zhp-accounts-types";

export interface TipiQueryPort {
  
  getRootUnits(memberNum: string): 
    query = text('''
SELECT DISTINCT
  o2.ORGUNITID,
  o2.GENERATEDNAME,
  CASE
    WHEN o3.ORGUNITTYPEID IN (1, 2) THEN "choragiew"       
    WHEN o3.ORGUNITTYPEID = 3 THEN "hufiec"
    ELSE "pjo"
END AS type
FROM person p 
LEFT JOIN user2userrole uu ON p.PERSON2USER = uu.USERID 
LEFT JOIN userrole u1 ON uu.USERROLEID = u1.USERROLEID
LEFT JOIN orgunit o2 ON o2.ORGUNITID = uu.ORGUNITID
LEFT JOIN orgunittype o3 ON o2.ORGUNIT2ORGUNITTYPE = o3.ORGUNITTYPEID
WHERE u1.USERROLEID IN (3, 4, 5, 28)
AND p.MEMBERID = :memberNum
ORDER BY o2.ORGUNITID ASC;
      ''')
  
  result = db.execute(query)
  result = result.all()
  
  resp = list(map(lambda r: {
    "id": r.ORGUNITID,
    "name": r.GENERATEDNAME,
    "type": r.type
  }, result))
;


  getUnit(unitId: number): 
    query = text('''
SELECT
  o.ORGUNITID AS id,
  o.GENERATEDNAME AS name,
  CASE
    WHEN o.ORGUNITID IS NULL THEN NULL
    WHEN ot.ORGUNITTYPEID IN (1, 2) THEN "choragiew"
    WHEN ot.ORGUNITTYPEID = 3 THEN "hufiec"
    ELSE "pjo"
  END AS type
FROM (SELECT 1) d
LEFT JOIN orgunit o 
  ON o.ORGUNITID = :unitId
LEFT JOIN orgunittype ot 
  ON o.ORGUNIT2ORGUNITTYPE = ot.ORGUNITTYPEID;
''')
  
  result = db.execute(query)
  result = result[0]

  resp = {
    "id": result.orgunitId,
    "name": result.generatedname,
    "type": result.type
  } 
;


  getSubUnits(memberNum: string, parentId: number):
    query = text('''
SELECT
    o2.ORGUNITCHILDID,
    o3.GENERATEDNAME,
    CASE
        WHEN o3.ORGUNIT2ORGUNITTYPE IN (1, 2) THEN "choragiew"
        WHEN o3.ORGUNIT2ORGUNITTYPE = 3 THEN "hufiec"
        ELSE "pjo"
    END AS type
FROM person p
JOIN user2userrole uu 
    ON uu.USERID = p.PERSON2USER
    AND uu.USERROLEID IN (3, 4, 5, 28)
    AND uu.WHOLEHIERARCHY = 1
JOIN orgunithierarchy o 
    ON o.ORGUNITPARENTID = uu.ORGUNITID
JOIN orgunithierarchy o2 
    ON o2.ORGUNITPARENTID = o.ORGUNITCHILDID
    AND o2.DEPTH = 1
JOIN orgunit o3 
    ON o3.ORGUNITID = o2.ORGUNITCHILDID
    AND o3.ENDDATE IS NULL
WHERE p.MEMBERID = :memberNum
  AND o.ORGUNITCHILDID = :parentId
GROUP BY o2.ORGUNITCHILDID, o3.GENERATEDNAME, o3.ORGUNIT2ORGUNITTYPE
ORDER BY o2.ORGUNITCHILDID ASC;
      ''')
  
  result = db.execute(query)
  result = result.all()
  
  resp = list(map(lambda r: {
    "id": r.ORGUNITCHILDID,
    "name": r.GENERATEDNAME,
    "type": r.type
  }, result))
;


  getMembers(unitId: number): 
    query = text('''
SELECT
p.FIRSTNAME,
p.LASTNAME,
p.MEMBERID
FROM orgunitperson o
INNER JOIN person p ON o.ORGUNITPERSON2PERSON = p.PERSONID 
WHERE o.ALLOCATION = 1 
AND o.VALIDTILL IS NULL
AND o.ORGUNITPERSON2ORGUNIT = :unitId
ORDER BY p.MEMBERID ASC;
      ''')
  
  result = db.execute(query)
  result = result.all()
  
  resp = list(map(lambda r: {
    "name": r.FIRSTNAME,
    "surname": r.LASTNAME,
    "membershipNumber": r.MEMBERID
  }, result))
;


  getMember(membershipNumber: string):
    query = text('''
SELECT
  p.FIRSTNAME,
  p.LASTNAME,
  p.MEMBERID,
  CASE
    WHEN p.PERSONID IS NULL THEN NULL
    WHEN EXISTS (
      SELECT 1
      FROM consent c
      WHERE c.REQUIRED = 1
        AND c.FORDS = 0
        AND NOT EXISTS (
          SELECT 1
          FROM personconsent pc
          WHERE pc.PERSONCONSENT2CONSENT = c.CONSENTID
            AND pc.PERSONCONSENT2PERSON = p.PERSONID
            AND (pc.REVOKEDATE IS NULL OR pc.GIVENDATE > pc.REVOKEDATE)
        )
    ) THEN 0
    WHEN p.BIRTHDATE >= NOW() - INTERVAL 13 YEAR
         AND NOT EXISTS (
           SELECT 1
           FROM personconsent pc
           WHERE pc.PERSONCONSENT2CONSENT = 11
             AND pc.PERSONCONSENT2PERSON = p.PERSONID
             AND (pc.REVOKEDATE IS NULL OR pc.GIVENDATE > pc.REVOKEDATE)
         )
    THEN 0
    WHEN p.NS = 1
         AND NOT EXISTS (
           SELECT 1
           FROM personconsent pc
           WHERE pc.PERSONCONSENT2CONSENT = 7
             AND pc.PERSONCONSENT2PERSON = p.PERSONID
             AND (pc.REVOKEDATE IS NULL OR pc.GIVENDATE > pc.REVOKEDATE)
         )
    THEN 0
    ELSE 1
  END AS hasAllRequiredConsents
FROM (SELECT 1) d
LEFT JOIN person p
  ON p.MEMBERID = :membershipNumber;
''')
  
  result = db.execute(query)
  result = result[0]

  resp = {
    "name": result.FIRSTNAME,
    "surname": result.LASTNAME,
    "membershipNumber": result.MEMBERID,
    "hasAllRequiredConsents": result.hasAllRequiredConsents
  } 
}
