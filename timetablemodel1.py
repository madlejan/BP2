print('****** START OF LOG FROM EXTERNAL PYTHON FILE ******')
# code presented here could be more simplified, which would improve performance a little bit, but is left as is, because of better readability

from gurobipy import *

# set of values
timeslots = set()
courses = {}
userPref = {}
userAvail = {}
rooms = {}
combinationslist = []

# load timeslots from file
with open('timeslots.txt', "r") as openfileobject:
    for line in openfileobject:
        timeslots.add(int(line.rstrip()))

# load courses from file
with open('courses.txt', "r") as openfileobject:
    for line in openfileobject:
        cleanline = line.rstrip()
        arr = cleanline.split()
        courses.setdefault(int(arr[0]), {})["user"] = int(arr[1])
        courses.setdefault(int(arr[0]), {})["roomtype"] = int(arr[2])

# load user preferences and availability from file
with open('user_preferences_availability.txt', "r") as openfileobject:
    for line in openfileobject:
        cleanline = line.rstrip()
        arr = cleanline.split()
        userPref.setdefault(int(arr[0]), {})[int(arr[1])] = int(arr[2])
        userAvail.setdefault(int(arr[0]), {})[int(arr[1])] = int(arr[3])

# load room availibility from file
with open('room_availibility.txt', "r") as openfileobject:
    for line in openfileobject:
        cleanline = line.rstrip()
        arr = cleanline.split()
        rooms.setdefault(int(arr[0]), {})[int(arr[1])] = int(arr[2])

# create all combinations
for c in courses:
    for t in timeslots:
	    combinationslist.append(tuple((c,t)))

combinations = tuplelist(combinationslist)
	
 
model = Model('Timetable scheduling')

# x[c,s] = 1 if course c is assigned to timeslot s
x = model.addVars(combinations, lb=0, ub=1, name='x')

# objetive function, minimalization of users uprefered times
model.setObjective(quicksum((userAvail[courses[c]["user"]][s] - userPref[courses[c]["user"]][s]) * x[c,s] for c,s in combinations), GRB.MINIMIZE)

# Condition 1
for c in courses:
    #every course is allocated only once, if we replace right side with different number, then we get how many times we need to allocate course
	model.addConstr(quicksum(x[c,s] for s in timeslots)==1)

# Condition 2
for c, s in combinations:
    # every user is available in the assigned time
	model.addConstr(x[c,s] <= userAvail[courses[c]["user"]][s])

# Condition 3
for s in timeslots:
	# there is enough rooms of certain type in time that is assigned to some course
    model.addConstr(sum(x[c, s] for c in courses) <= rooms[s][courses[c]["roomtype"]])

# Condition 4
# if course is assigned to some user than that same user cannot be assigned to different course, that has the same time
for c, s in combinations:
    if x[c,s] == 1 :
        for c2, s2 in combinations:
            if ((courses[c]["user"] == courses[c2]["user"]) and (c != c2)) :
                model.addConstr(x[c2,s]==0)

model.optimize()
try:
	model.printAttr('x') # slack variables
except:
	print("model is not feasible, relaxing")
	model.feasRelaxS(0, False, True, True)
	model.optimize()


# used for printing assigned model variables

#for v in model.getVars():
#    if v.X != 0:
#        print("%s %f" % (v.Varname, v.X))

model.write("timetabling.sol")

print('****** END OF LOG FROM EXTERNAL PYTHON FILE ******')