---
title: Changes to AppEngine's _from_entity
date: '2011-09-08T15:49:00.000+02:00'
---

Both my blog and Enstore experienced a serious outage today. This was caused by a recent change to how App Engine initializes entities. The error was:

    BadArgumentError: Cannot use key and key_name at the same time with different values

A common trick to detect wether an entity is loaded from datastore or not is to check `if kwargs.get('_from_entity') == True:` in the models `__init__` method. Before today's change \_from\_entity was a bool argument and this code worked perfectly. Today's change made \_from\_entity a dictionary containing the entities' properties and values. Because of this the explicit check for `True` returned `False` and both Enstore and this blog started returning 500 errors.

The issues were resolved by changing :

    `if kwargs.get('_from_entity') == True:` 

to: 

    `if kwargs.get('_from_entity'):`.
