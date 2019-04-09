const WIN_REWARD = 10;
const ALIVE_REWARD = 1;
const LOSS_PUNISH = -50;
const DRAW_PUNISH = -10;

// Todo for the neural network
// example from : https://cs.stanford.edu/people/karpathy/convnetjs/demo/rldemo.html

const playerBrain = () => {
	//var num_inputs = (16 * 16) + 2; // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
	var num_inputs = 5*5;
	var num_actions = 4; // 5 possible angles agent can turn
	//var temporal_window = 8; // amount of temporal memory. 0 = agent lives in-the-moment :)
	//var network_size = num_inputs * temporal_window + num_actions * temporal_window + num_inputs;

	// the value function network computes a value of taking any of the possible actions
	// given an input state. Here we specify one explicitly the hard way
	// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
	// to just insert simple relu hidden layers.
	var layer_defs = [];
	layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: num_inputs });
	//layer_defs.push({ type: 'conv', sx: 1, filters: 25, stride: 1, pad: 0, activation: 'relu' });
    //layer_defs.push({ type: 'conv', sx: 1, filters: 25, stride: 1, pad: 0, activation: 'relu' });
	layer_defs.push({ type: 'fc', num_neurons: 120,  activation: 'relu' });//raus
    layer_defs.push({ type: 'fc', num_neurons: 120,  activation: 'relu' });//raus
    layer_defs.push({ type: 'fc', num_neurons: 120,  activation: 'relu' });
	layer_defs.push({ type: 'regression', num_neurons: num_actions });

	// options for the Temporal Difference learner that trains the above net
	// by backpropping the temporal difference learning rule.
	var tdtrainer_options = { learning_rate: 0.01, momentum: 0.0, batch_size: 25, l1_decay: 0.01, l2_decay: 0.001 };

	var opt = {};
	opt.temporal_window = 8;
    opt.experience_size = 100000;
    opt.start_learn_threshold = 1500; // 1000 normal
    opt.gamma = 0.8;
    opt.learning_steps_total = 200000;
    opt.learning_steps_burnin = 100;
    opt.epsilon_min = 0.05;
    opt.epsilon_test_time = 0.2;
    opt.layer_defs = layer_defs;
	opt.tdtrainer_options = tdtrainer_options;

	return new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
}
