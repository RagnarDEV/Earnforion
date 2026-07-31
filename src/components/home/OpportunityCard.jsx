import { Heart, Scales, Star, ShieldCheck } from 'phosphor-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function OpportunityCard({ data }) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={data.logo}
          alt={`${data.platform} logo`}
          className="w-10 h-10 rounded-lg object-contain"
        />
        <div>
          <p className="font-medium text-sm">{data.platform}</p>
          {data.verified && (
            <span className="flex items-center text-green-600 text-xs gap-1">
              <ShieldCheck size={14} weight="fill" /> Verified
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
        {data.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge color="blue">{data.category}</Badge>
        <Badge color="green" icon={<Star size={14} weight="fill" />}>
          {data.rating}
        </Badge>
        <Badge color="amber">{data.difficulty}</Badge>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-sm font-medium text-green-700 dark:text-green-400">
          {data.earnings}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Save opportunity"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Heart size={18} />
          </button>
          <button
            aria-label="Add to compare"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Scales size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
}
