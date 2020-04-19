from gurobipy import *

model = Model('Timetable scheduling')

timeslots = {"Mo1", "Mo2"}

courses = {"badminton1":{"user": "Jan", "roomtype": "B"}, "hokey":{"user": "Aneta", "roomtype": "B"}}

userPref = { "Jan": {"Mo1": 0, "Mo2": 1}, 
			  "Aneta": {"Mo1": 0, "Mo2": 0}}

userAvail = { "Jan": {"Mo1": 1, "Mo2": 1}, 
			  "Aneta": {"Mo1": 1, "Mo2": 0}}
			  
rooms = {"Mo1": {"A": 1, "B": 1}, "Mo2": {"A": 0, "B": 2}} 
			  
combinations = tuplelist([
    ('badminton1', 'Mo1'),('badminton1', 'Mo2'), ('hokey', 'Mo1'), ('hokey', 'Mo2')])
	
 
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
                model.addConstr(x[c,s2]==0)

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

model.write("timetablingExample.sol")
